import { GuildMember, User } from "discord.js";
import { Command } from "../../structures/Command";

import Mute from "../../models/mute.model";

import ms from "ms";

export default new Command({
    name: "lfgmute",
    description: "LFG Mutes a user in the discord.",
    userPermissions: ["MANAGE_MESSAGES"],
    options: [
        {
            name: "target",
            description: "Select a user you want to LFG mute.",
            type: "USER",
            required: true
        },
        {
            name: "reason",
            description: "What is the reason for muting this user?",
            type: "STRING",
            required: true
        },
        {
            name: "duration",
            description: "How long are you muting this user for?",
            type: "STRING",
            required: false
        }
    ],

    run: async ({ client, interaction }) =>
    {
        let target: User        = interaction.options.getUser("target");
        let reason: string      = interaction.options.getString("reason");
        let duration: string    = interaction.options.getString("duration");

        let member: GuildMember = interaction.guild.members.resolve(target.id);

        if (!member)
        {
            return interaction.followUp('❌ Could not find the user.');
        }

        if (!member)
        {
            return interaction.followUp(`❌ Couldn't find ${target} in the server.`);
        }

        if (reason.length < 3)
        {
            return interaction.followUp(`❌ Please provide a more detailed reason.`);
        }

        if (member.roles.highest.comparePositionTo(interaction.member.roles.highest) > 0)
        {
            return interaction.followUp(`❌ Couldn't LFG mute ${member} as they're higher than you.`);
        }

        let parsedDuration: number = ms(duration ?? "0") ?? 0;

        let member_mention_str:             string = client.mention_str(member.user);
        let interaction_member_mention_str: string = client.mention_str(interaction.user);

        if ((await Mute.countDocuments({ guild_id: interaction.guild.id, discord_id: member.id })) > 0)
        {
            return interaction.followUp(`❌ ${member} is already LFG muted.`);
        }
        
        await Mute.create({
            type: "LFG",
            guild_id: interaction.guild.id,
            discord_id: target.id,
            moderator_id: interaction.user.id,
            expires: parsedDuration ? (Date.now() + parsedDuration) : 0,
            reason,
        });

        await member.roles.add(client.lfg_muted_role(interaction.guildId), reason);

        client.channel_log(
            interaction.guildId, 
            parsedDuration !== 0
                ? `🤐 ${interaction_member_mention_str} temporarily LFG muted ${member_mention_str} for **${duration}**\n\`[ Reason ]\` ${reason}`
                : `🔇 ${interaction_member_mention_str} permanently LFG muted ${member_mention_str}\n\`[ Reason ]\` ${reason}`
        );

        return interaction.followUp(`✅ ${member} was LFG muted.`);
    }
})