import { ApplicationCommandDataResolvable } from "discord.js";

export interface ICommandOptions {
    guildId?: string;
    commands: ApplicationCommandDataResolvable[];
}