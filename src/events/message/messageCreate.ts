import { client } from "../..";

import {
    AnyChannel,
    DMChannel,
    Guild,
    Message,
    MessageEmbed,
    NewsChannel,
    PartialDMChannel,
    TextChannel,
    ThreadChannel
} from "discord.js";

import { Event } from "../../structures/Event";

export default new Event("messageCreate", async (message: Message) =>
{
    if (message?.author?.bot || !message.guild) return;

    let channel = message.channel;

    if (!(channel instanceof TextChannel)) return;

    let message_new_lines: number = message.content.split("\n").length;

    if (ContainsURL(message) || message_new_lines > client.config.discord.auto_mod.settings.max_new_lines)
    {
        if (message.deletable)
        {
            message.delete();
        }
    }

    if (ContainsServer(message))
    {
        PostLFGFeed(message);
    }
});

function PostLFGFeed(message: Message)
{
    const embed: MessageEmbed = new MessageEmbed();
          embed.setColor("RANDOM");
          embed.setAuthor({
            name: `${message.guild.name} - LFG Trigger`,
            iconURL: message.guild.iconURL()
          });
          embed.setDescription(`[Jump to Message](${message.url})`);
          embed.addField("Member", client.mention_str(message.author));
          embed.addField("Trigger Word", `\`\`\`${GetServerMentioned(message)}\`\`\``);
          embed.setTimestamp();

    let lfg_feed: string = client.config.discord.rust_legends.channels["LFG Feed"];

    if (!lfg_feed) return;

    let lfg_channel: AnyChannel = client.channels.resolve(lfg_feed);
        lfg_channel = lfg_channel as TextChannel;

    if (!lfg_channel) return;

    lfg_channel.send({ embeds: [embed] });
};

function GetServerMentioned(message: Message) : string
{
    let server_list: string[] = client.config.discord.guilds[message.guild.id]?.servers ?? [];

    for (let server of server_list)
    {
        if (message.content.toLowerCase().includes(server.toLowerCase()))
        {
            return server;
        }
    }

    return "Error: Server Not Found";
}

function ContainsURL(message: Message): boolean
{
    let content: string = message.content;

    if (content.includes("discord.gg/")) return true;

    let url: string = content.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g)?.[0];

    if (!url) return false;

    let whitelisted_urls: string[] = client.config.discord.guilds[message.guild.id].whitelisted_urls;

    return whitelisted_urls.includes(`https://${url.split("/")[2]}`);
};

function ContainsServer(message: Message): boolean
{
    let lfg_channel: string = client.config.discord.guilds[message.guild.id].channels["LFG"];

    if (message.channelId !== lfg_channel) return false;
    
    let content: string = message.content.toLowerCase();

    let server_list: string[] = client.config.discord.guilds[message.guild.id]?.servers ?? [];

    return server_list.some(server => content.includes(server));
};