import { Command } from "../../structures/Command";

export default new Command({
    name: "ping",
    description: "Ping Pong!",
    run: async ({ interaction }) => interaction.followUp(`🏓 Pong! API: ${interaction.client.ws.ping}ms`)
})