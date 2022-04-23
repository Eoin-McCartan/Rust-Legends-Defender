import { client } from "../..";
import { Collection, Guild, GuildMember, RoleResolvable, Snowflake } from "discord.js";
import { Event } from "../../structures/Event";

import Mute from "../../models/mute.model";
import User from "../../models/user.model";

import TimeAgo from "../../services/TimeAgo";

export default new Event("guildMemberAdd", async (member: GuildMember) =>
{
    let { enabled, joins, new_accounts } = client.config.discord.anti_raid;

    let guild: Guild = member.guild;

    let is_new_account: boolean         = new Date(member.user.createdTimestamp).getTime() > Date.now() - new_accounts.account_age * 24 * 60 * 60 * 1000;
    let created_at_ago: string          = `${TimeAgo.format(new Date(member.user.createdTimestamp))}`;

    let member_mention_str: string      = client.mention_str(member.user);

    client.channel_log(
        guild.id, 
        `📥 ${member_mention_str} joined the server. ${is_new_account ? "🆕" : ""}\n**Creation:** ${new Date(member.user.createdTimestamp).toUTCString()} (**${created_at_ago}**)`
    );

    let is_muted: boolean = (await Mute.countDocuments({ 
        guild:      guild.id,
        discord_id: member.id,
        expires:    { $gte: new Date().toISOString() }
    })) > 0;

    if (is_muted)
    {
        await member.roles.add(client.muted_role(guild.id), "Applying Existing Mute");
    }

    let roles: { [key: string]: string[]; } = (await User.findOne({ discord_id: member.id, roles: { $exists: true } }))?.roles ?? { [guild.id]: [] };

    if (roles[guild.id]?.length > 0)
    {
        let roles_resolvable: Array<RoleResolvable> = roles[guild.id].map((x: Snowflake) => guild.roles.cache.get(x));

        await member.roles.add(roles_resolvable, "Applying Existing Roles");

        await User.updateOne({ discord_id: member.id }, { roles: roles[guild.id] = [] });
    }

    if (!enabled) return;

    if (new_accounts.enabled)
    {
        let members: Collection<string, GuildMember> = guild.members.cache.filter((x) => x.joinedTimestamp > (Date.now() - new_accounts.trigger * 1000));
            members.filter((x) => x.user.createdTimestamp > (Date.now() - new_accounts.account_age * 24 * 60 * 60 * 1000));

        if (members.size < new_accounts.trigger) return;
        
        await punish_member(
            member,
            joins.punishment,
            `Anti-Raid: User joined during suspected raid: ${members.size} members joined with an account created within the last ${new_accounts.account_age} days.`
        );
    }

    if (joins.enabled)
    {
        let join_count: number = guild.members.cache.filter(m => m.joinedTimestamp > Date.now() - (joins.trigger * 1000)).size;

        if (join_count < joins.trigger) return;

        await punish_member(
            member,
            joins.punishment,
            `Anti-Raid: User joined during suspected raid: ${join_count} members joined in the ${joins.trigger} seconds.`
        );
    }
});

async function punish_member(member: GuildMember, punishment: string, reason: string)
{
    if (punishment === "kick")      await member.kick(reason);

    else if (punishment === "ban")  await member.ban({ reason, days: 7 });
}