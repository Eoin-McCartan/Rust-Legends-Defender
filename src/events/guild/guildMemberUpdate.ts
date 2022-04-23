import { client } from "../..";
import { Guild, GuildMember } from "discord.js";
import { Event } from "../../structures/Event";

export default new Event("guildMemberUpdate", async (old_member: GuildMember, new_member: GuildMember) =>
{
    let guild: Guild = new_member.guild;

    if (old_member?.user?.tag !== new_member?.user?.tag)
    {
        let old_member_mention_str: string = client.mention_str(old_member.user);
        let new_member_mention_str: string = client.mention_str(new_member.user);
        
        client.channel_log(
            guild.id,
            `📛 ${old_member_mention_str} changed their username to ${new_member_mention_str}`
        );
    }
});