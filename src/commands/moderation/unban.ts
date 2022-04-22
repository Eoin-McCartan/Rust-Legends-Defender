import { Collection, Guild, GuildBan, GuildBanResolvable, GuildMember } from "discord.js";
import { Command } from "../../structures/Command";

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

    run: async ({ client, interaction }) =>
    {
        let target: string  = interaction.options.getString("target");
        let reason: string  = interaction.options.getString("reason");

        let interaction_member: GuildMember = interaction.guild.members.resolve(interaction.user.id);

        if (reason?.length < 3)
        {
            return interaction.followUp(`❌ Please provide a more detailed reason.`);
        }

        let bans: Collection<string, GuildBan> = await interaction.guild.bans.fetch();
        let target_ban: GuildBan = bans.find(ban => ban.user.id === target);

        if (!target_ban)
        {
            return interaction.followUp(`❌ <@${target}> is not banned.`);
        }

        await interaction.guild.bans.remove(target, `${interaction_member.user.username} @ ${new Date().toUTCString()} - ${reason}`);

        let member_mention_str:             string = client.mention_str(target_ban.user);
        let interaction_member_mention_str: string = client.mention_str(interaction_member.user);

        client.channel_log(
            interaction.guildId, 
            `🔧 ${interaction_member_mention_str} unbanned ${member_mention_str}\n\`[ Reason ]\` ${reason}`
        );

        return interaction.followUp(`✅ <@${target}> was unbanned.`);
    }
})