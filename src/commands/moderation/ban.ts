import { GuildMember, User } from "discord.js";
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

    run: async ({ client, interaction }) =>
    {
        let target: User = interaction.options.getUser("target");
        let reason: String = interaction.options.getString("reason");

        let member: GuildMember = interaction.guild.members.resolve(target.id);

        if (!member)
        {
            return interaction.followUp('❌ Could not find the user.');
        }

        if (!member)
        {
            return interaction.followUp(`❌ Couldn't find ${target} in the server.`);
        }

        if (!member.bannable)
        {
            return interaction.followUp(`❌ Couldn't ban ${member} (Discord API Says they're unbannable).`);
        }

        if (reason?.length < 3)
        {
            return interaction.followUp(`❌ Please provide a more detailed reason.`);
        }

        if (member.roles.highest.comparePositionTo(interaction.member.roles.highest) > 0)
        {
            return interaction.followUp(`❌ Could not ban ${member} as they're higher than you.`);
        }

        await member.ban({
            reason: `${interaction.user.username} @ ${new Date().toUTCString()} - ${reason}`,
            days: 7
        });

        let member_mention_str:             string = client.mention_str(member.user);
        let interaction_member_mention_str: string = client.mention_str(interaction.user);

        client.channel_log(
            interaction.guildId, 
            `🔨 ${interaction_member_mention_str} banned ${member_mention_str}\n\`[ Reason ]\` ${reason}`
        );

        return interaction.followUp(`✅ ${member} was banned.`);
    }
})