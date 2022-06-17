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

    if (old_member?.roles !== new_member?.roles)
    {
        let member_mention_str: string = client.mention_str(new_member.user);

        let old_member_roles: string[] = old_member.roles.cache.map(role => role.name);
        let new_member_roles: string[] = new_member.roles.cache.map(role => role.name);

        let added_roles: string = new_member_roles.filter(role => !old_member_roles.includes(role))?.join(", ");
        let removed_roles: string = old_member_roles.filter(role => !new_member_roles.includes(role))?.join(", ");

        client.channel_log(
            guild.id,
            `♻️ ${member_mention_str} had the following role ${added_roles ? "added" : "removed"}:\n\`${added_roles ? added_roles : removed_roles}\``
        );
    }
});