import { client } from "../..";
import { Guild, GuildMember, RoleResolvable, Snowflake } from "discord.js"
import { Event } from "../../structures/Event"

import TimeAgo from "../../services/TimeAgo";

import User from "../../models/user.model";

export default new Event("guildMemberRemove", async (member: GuildMember) =>
{
    let guild: Guild = member.guild;

    let member_mention_str: string              = client.mention_str(member.user);
    let member_role_ids:    Array<Snowflake>    = member.roles.cache.filter(x => x.id !== guild.id).map(x => x.id);
    let member_role_names:  Array<Snowflake>    = member.roles.cache.filter(x => x.id !== guild.id).map(x => `\`${x.name}\``);
    let joined_at_ago:      string              = `${TimeAgo.format(new Date(member.joinedTimestamp))}`;
    
    client.channel_log(
        guild.id,
        `📤 ${member_mention_str} left or was kicked from the server.\n` +
        `**Joined:** ${new Date(member.joinedTimestamp).toUTCString()} (**${joined_at_ago}**)` +
        `${member_role_names.length > 0 ? `\n**Roles:** ${member_role_names.join(", ")}` : ""}`
    );

    let roles: { [key: Snowflake]: Array<Snowflake> } = {
        [guild.id]: member_role_ids
    };

    await User.updateOne({ discord_id: member.id }, { $addToSet: { roles } }, { upsert: true });
});