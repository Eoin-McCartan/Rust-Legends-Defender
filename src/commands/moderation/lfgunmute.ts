import { GuildMember, User } from "discord.js";
import { Command } from "../../structures/Command";

import Mute from "../../models/mute.model";

export default new Command({
    name: "lfgunmute",
    description: "LFG Unmutes a user in the discord.",
    options: [
        {
            name: "target",
            description: "Select a user you want to LFG unmute.",
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
            return interaction.followUp(`❌ Couldn't LFG unmute ${member} as they're higher than you.`);
        }

        let member_mention_str:             string = client.mention_str(member.user);
        let interaction_member_mention_str: string = client.mention_str(interaction.user);

        if ((await Mute.countDocuments({ guild_id: interaction.guild.id, discord_id: member.id })) < 0)
        {
            return interaction.followUp(`❌ ${member} is not LFG muted.`);
        }

        await Mute.deleteOne({ type: "LFG", guild_id: interaction.guild.id, discord_id: member.id });
        
        await member.roles.remove(client.lfg_muted_role(interaction.guildId), reason);

        client.channel_log(
            interaction.guildId,
            `🔊 ${interaction_member_mention_str} LFG unmuted ${member_mention_str}\n\`[ Reason ]\` ${reason}`
        );

        return interaction.followUp(`✅ ${member} was LFG unmuted.`);
    }
})