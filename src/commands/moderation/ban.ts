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
        let user   = interaction.user;

        let member = await interaction.guild.members.fetch(target.id);

        if (!member)
        {
            return interaction.channel.send(`🚫 Couln't find ${target.username} in the server.`);
        }

        if (!member.bannable)
        {
            return interaction.followUp("🚫 Couldn't ban ${user.username}.");
        }
    }
})