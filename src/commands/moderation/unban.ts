import { GuildMember } from "discord.js";
import { Command } from "../../structures/Command";
import ban from "./ban";

export default new Command({
    name: "unban",
    description: "Unbans a user from the discord.",
    userPermissions: ["BAN_MEMBERS"],
    options: [
        {
            name: "target",
            description: "Enter a Discord ID you want to unban from the Discord.",
            type: "STRING",
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
        let target = interaction.options.getString("target");
        let reason = interaction.options.getString("reason");

        let interaction_member: GuildMember = await interaction.guild.members.fetch(interaction.user.id);

        let bans = await interaction.guild.bans.fetch();

        if (bans.size === 0)
        {
            return interaction.channel.send(`🚫 There are no bans in this server.`);
        }

        if (reason?.length < 3)
        {
            return interaction.followUp(`🚫 Please provide a more detailed reason.`);
        }

        let target_ban = bans.find(ban => ban.user.id === target);

        if (!target_ban)
        {
            return interaction.followUp(`🚫 Couldn't find a ban for ${target}.`);
        }

        await interaction.guild.bans.remove(target, `${interaction_member.user.username} @ ${new Date().toUTCString()} - ${reason}`);

        return interaction.followUp(`🚫 Unbanned ${target} for ${reason}.`);
    }
})