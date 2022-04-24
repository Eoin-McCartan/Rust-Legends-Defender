import { client } from "../..";
import { Message, MessageEmbed } from "discord.js";
import { Event } from "../../structures/Event";

export default new Event("messageDelete", async (message: Message) =>
{
    if (message.author.bot) return;

    let message_str: string = message.content;
    let message_mention_str: string = client.mention_str(message.author);

    let embed: MessageEmbed = new MessageEmbed();
        embed.setColor("RED");
        embed.setDescription(`${message_str.substring(0, 1021)}`);
        embed.setImage("https://cdn.discordapp.com/attachments/673841458519867410/712212708463738880/bar.png");

    client.channel_log(
        message.guild.id,
        `🗑️ ${message_mention_str}'s message has been deleted from ${message.channel}:`,
        embed
    );
});