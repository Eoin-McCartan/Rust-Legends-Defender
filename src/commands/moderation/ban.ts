import { GuildMember } from "discord.js";
import { Command } from "../../structures/Command";

export default new Command({
    name: "ban",
    description: "Ban a user from the discord.",
    userPermissions: ["BAN_MEMBERS"],
    options: [
        {
            name: "target",
            description: "Select a user you want to ban.",
            type: "USER",
            required: true
        },
        {
            name: "reason",
            description: "What is the reason for banning this user?",
            type: "STRING",
            required: true
        }
    ],

    run: async ({ interaction }) =>
    {
        let target = interaction.options.getUser("target");
        let reason = interaction.options.getString("reason");

        let member: GuildMember = await interaction.guild.members.fetch(target.id);
        let interaction_member: GuildMember = await interaction.guild.members.fetch(interaction.user.id);

        if (!member)
        {
            return interaction.channel.send(`🚫 Couln't find ${target.username} in the server.`);
        }

        if (!member.bannable)
        {
            return interaction.followUp(`🚫 Couldn't ban ${member.user.username} (Discord API Says they're unbannable).`);
        }

        if (reason?.length < 3)
        {
            return interaction.followUp(`🚫 Please provide a more detailed reason.`);
        }

        if (member.roles.highest.comparePositionTo(interaction_member.roles.highest) > 0)
        {
            return interaction.followUp(`🚫 Could not ban ${member.user.username} as they're higher than you.`);
        }

        await member.ban({
            reason: `${interaction_member.user.username} @ ${new Date().toUTCString()} - ${reason}`,
            days: 7
        });

        return interaction.followUp(`🚫 Banned ${member.user.username} for ${reason}.`);
    }
})