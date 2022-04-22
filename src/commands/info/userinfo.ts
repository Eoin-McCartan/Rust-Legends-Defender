import { MessageEmbed } from "discord.js";
import { Command } from "../../structures/Command";

const status_emojis = {
    online:     "🟢",
    idle:       "🟡",
    dnd:        "🔴",
    invisible:  "⚫"
};

export default new Command({
    name: "userinfo",
    description: "Display information about a user.",
    userPermissions: ["BAN_MEMBERS"],
    options: [
        {
            name: "target",
            description: "Select a user you want to detail.",
            type: "USER",
            required: true
        }
    ],
    run: async ({ interaction }) =>
    {
        let target = interaction.options.getUser("target");

        let target_member = await interaction.guild.members.fetch(target.id);

        if (!target_member)
        {
            return interaction.channel.send(`🚫 Couln't find ${target.username} in the server.`);
        }

        let member_number = interaction.guild.members.cache.filter(m => m.joinedTimestamp > target_member.joinedTimestamp).size;    
        let member_roles = target_member.roles.cache.filter(r => r.id !== interaction.guild.id).map(x => `\`${x.name}\``).join(", ")
        let member_status = target_member.presence?.status 
            ? `${status_emojis[target_member.presence.status]} **${target_member.presence.status}**`
            : "⚫ **Invisible**";

        let embed: MessageEmbed = new MessageEmbed();
            embed.setColor(target_member.roles.highest.color ?? "#000000");
            embed.setThumbnail(target.avatarURL());

            embed.setDescription(
                `▫ Discord ID: **${target.id}**\n` + 
                `▫ Roles: **${member_roles}**\n` +
                `▫ Status: ${member_status}\n` +
                `▫ Account Creation: **${new Date(target.createdAt).toUTCString()}**\n` +
                `▫ Guild Join Date: **${new Date(target_member.joinedAt).toUTCString()}** ${member_number > 0 ? `\`(#${member_number})\`` : ""}`
            );
        
        return interaction.followUp({ 
            content: `👤 Information about ${target.tag}:`, 
            embeds: [embed]
        });
    }
})