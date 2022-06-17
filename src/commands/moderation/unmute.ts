import { GuildMember, User } from "discord.js";
import { Command } from "../../structures/Command";

import Mute, { IMute } from "../../models/mute.model";

import ms from "ms";

export default new Command({
    name: "unmute",
    description: "Unmutes a user in the discord.",
    userPermissions: ["MANAGE_MESSAGES"],
    options: [
        {
            name: "target",
            description: "Select a user you want to unmute.",
            type: "USER",
            required: true
        },
        {
            name: "reason",
            description: "What is the reason for unmuting this user?",
            type: "STRING",
            required: true
        }
    ],

    run: async ({ client, interaction }) =>
    {
        let target: User        = interaction.options.getUser("target");
        let reason: string      = interaction.options.getString("reason");

        let member: GuildMember = interaction.guild.members.resolve(target.id);

        if (!member)
        {
            return interaction.followUp('❌ Could not find the user.');
        }

        if (!member)
        {
            return interaction.followUp(`❌ Couldn't find ${target} in the server.`);
        }

        if (reason?.length < 3)
        {
            return interaction.followUp(`❌ Please provide a more detailed reason.`);
        }

        if (member.roles.highest.comparePositionTo(interaction.member.roles.highest) > 0)
        {
            return interaction.followUp(`❌ Couldn't unmute ${member} as they're higher than you.`);
        }

        let member_mention_str:             string = client.mention_str(member.user);
        let interaction_member_mention_str: string = client.mention_str(interaction.user);

        if ((await Mute.countDocuments({ guild_id: interaction.guild.id, user_id: member.id })) < 0)
        {
            return interaction.followUp(`❌ ${member} is not muted.`);
        }

        await Mute.deleteOne({ guild_id: interaction.guild.id, user_id: member.id });

        await member.roles.remove(client.muted_role(interaction.guildId), reason);

        client.channel_log(
            interaction.guildId,
            `🔊 ${interaction_member_mention_str} unmuted ${member_mention_str}\n\`[ Reason ]\` ${reason}`
        );

        return interaction.followUp(`✅ ${member} was unmuted.`);
    }
})