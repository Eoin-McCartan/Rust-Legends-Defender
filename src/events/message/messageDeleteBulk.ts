import { Collection, Message, MessageAttachment, MessageEmbed, PartialMessage, Snowflake, TextChannel } from "discord.js";
import { client } from "../..";
import { Event } from "../../structures/Event";

import * as Transcripts from "discord-html-transcripts";

export default new Event("messageDeleteBulk", async (messages: Collection<string, Message<boolean> | PartialMessage>) =>
{
    let first_message           = messages.first();
    let channel                 = first_message.channel;
    let guildId: Snowflake      = first_message.guildId;

    let embed: MessageEmbed = new MessageEmbed();
        embed.setColor("RED");

    let transcript: MessageAttachment | Buffer = Transcripts.generateFromMessages(messages as unknown as Message[], channel as TextChannel);

    client.channel_log(
        guildId,
        `🗑️ **${messages.size}** messages were bulk deleted:`,
        embed,
        transcript as MessageAttachment
    )
});