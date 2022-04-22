import Config from "../../config";
const config: Config = require("../../config.json");

import { 
    ApplicationCommandDataResolvable, 
    Client, 
    ClientEvents, 
    Collection, 
    User,
    Guild, 
    NonThreadGuildBasedChannel, 
    MessageEmbed, 
    TextChannel,
    Snowflake
} from "discord.js";

import { Event } from "../structures/Event";
import { CommandType } from "../typings/Command";
import { RegisterCommandsOptions } from "../typings/Client";

import glob from "glob-promise";

export class RLClient extends Client
{
    public config: Config;
    public commands: Collection<string, CommandType> = new Collection();

    constructor()
    {
        super({ intents: 32767 });
    }

    channel_log = async (guildId: Snowflake, content: string, embed?: MessageEmbed) =>
    {  
        let guild: Guild = await this.guilds.fetch(guildId);

        if (!guild) return;

        let channel_id: string = config.discord.guilds[guild.id]?.channels["Discord Logs"];

        if (!channel_id) return;

        let text_channel: NonThreadGuildBasedChannel | TextChannel = await guild.channels.fetch(channel_id);
            text_channel = text_channel as TextChannel;

        let message_payload: any = {
            content
        };

        if (embed) 
        {
            message_payload = { 
                ...message_payload,
                embeds: [embed] 
            };
        }

        await text_channel.send(message_payload);
    }

    mention_str = (user: User) => `${user} ${user.username}#${user.discriminator} (${user.id})`
    
    start = () =>
    {
        this.registerModules();

        this.login(config.discord.token);
    }

    importFile = async (path: string) =>
    {
        return (await import(path))?.default;
    }

    registerCommands = async ({ guildId, commands }: RegisterCommandsOptions) =>
    {
        if (!guildId)
        {
            this.application.commands.set(commands);

            return;
        }

        let guild: Guild = (await this.guilds.fetch(guildId));

        guild.commands.set([]);
        guild.commands.set(commands);

        console.log(`[DEBUG] Registerd Guild: ${guild.name}`);
    }

    registerModules = async () =>
    {
        const slashCommands: ApplicationCommandDataResolvable[] = [];

        const commandFiles: string[] = await glob(`${__dirname}/../commands/*/*{.ts,.js}`);
    
        commandFiles.forEach(async (filePath: string) =>
        {
            const command: CommandType = await this.importFile(filePath);

            if (!command.name) return;

            this.commands.set(command.name, command);

            slashCommands.push(command);
        });
        
        this.on("ready", async() =>
        {
            for (const guildId in config.discord.guilds)
            {
                this.registerCommands({ guildId, commands: slashCommands });
            }
        });

        const eventFiles: string[] = await glob(`${__dirname}/../events/*/*{.ts,.js}`);

        eventFiles.forEach(async (filePath: string) =>
        {
            const event: Event<keyof ClientEvents> = await this.importFile(filePath);

            this.on(event.name, event.run);
        });
    };
}