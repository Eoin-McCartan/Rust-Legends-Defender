import { Message, MessageEmbed, Snowflake } from "discord.js";
import { client } from "../..";
import { Event } from "../../structures/Event";

export default new Event("messageUpdate", async (old_message: Message, new_message: Message) =>
{
    if (old_message?.author?.bot || new_message?.author?.bot) return;

    if (old_message?.content !== new_message?.content)
    {   
        let guildId: Snowflake = new_message.guild.id;

        let embed: MessageEmbed = new MessageEmbed();
            embed.setColor("YELLOW");
            embed.addField("From:", old_message.content);
            embed.addField("To:", new_message.content);
            embed.setImage("https://cdn.discordapp.com/attachments/673841458519867410/712212708463738880/bar.png");


        let author_mention_str: string = client.mention_str(new_message.author);
        
        client.channel_log(
            guildId,
            `📝 ${author_mention_str} edited their message in ${new_message.channel}:`,
            embed
        )
    }
});