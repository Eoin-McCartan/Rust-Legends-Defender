import { Snowflake } from "discord.js";
import { client } from "../..";
import { Command } from "../../structures/Command";

interface IResponse {
    channel_name: string;
    message: string;
}

export default new Command({
    name: "question",
    description: "Use this to select premade responses to any questions.",
    options: [
        {
            name: "question",
            description: "What is the type of question you want to answer?",
            type: "STRING",
            required: true
        }
    ],
    run: async ({ interaction }) =>
    {
        let question: string = interaction.options.getString("question");

        let response: IResponse = client.config.discord.guilds[interaction.guild.id]?.responses?.[question];

        if (!response)
        {
            let questions: string[] = Object.keys(client.config.discord.guilds[interaction.guild.id]?.responses || {});

            return interaction.followUp({ content: "❌ Here are a list of valid arguments: " + questions.map(x => `\`${x}\``)?.join(", "), ephemeral: true });
        }

        let channel_id: Snowflake = client.config.discord.guilds[interaction.guild.id]?.channels[response.channel_name];

        response.message = response.message.includes("{CHANNEL_ID}") 
                ? response.message.replace(/{CHANNEL_ID}/g, channel_id) 
                : response.message;
        
        return interaction.followUp(response.message);
    }
})