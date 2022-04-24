import { client } from "../..";

import {
    DMChannel,
    Guild,
    Message,
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

    if (ContainsURL(message)
        || ContainsServer(message)
        || message_new_lines > client.config.discord.auto_mod.settings.max_new_lines
    )
    {
        if (message.deletable)
        {
            message.delete();
        }
    }
});

function ContainsURL(message: Message): boolean
{
    let content: string = message.content;

    if (content.includes("discord.gg/")) return true;

    let url: string = content.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g)?.[0];

    if (!url) return false;

    let whitelisted_urls: string[] = client.config.discord.guilds[message.guild.id].whitelisted_urls;

    if (whitelisted_urls.includes(`https://${url.split("/")[2]}`)) return false;

    return true;
}

function ContainsServer(message: Message): boolean
{
    let lfg_channel: string = client.config.discord.guilds[message.guild.id].channels["LFG"];

    if (message.channelId !== lfg_channel) return false;
    
    let content: string = message.content.toLowerCase();

    let server_list: string[] = client.config.discord.guilds[message.guild.id]?.servers ?? [];

    if (server_list.some(server => content.includes(server))) return true;

    return false;
}