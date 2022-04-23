import Config from "../../config";
const config: Config = require("../../config.json");

import { 
    ApplicationCommand,
    ApplicationCommandData,
    ApplicationCommandResolvable,
    ApplicationCommandDataResolvable, 
    Client, 
    ClientEvents, 
    Collection, 
    User,
    Guild, 
    NonThreadGuildBasedChannel, 
    MessageEmbed, 
    TextChannel,
    Snowflake,
    MessageAttachment
} from "discord.js";

import { Event } from "../structures/Event";
import { ICommandType } from "../typings/Command";
import { ICommandOptions } from "../typings/Client";

import glob from "glob-promise";

export class RLClient extends Client
{
    public config: Config = config;
    public commands: Collection<string, ICommandType> = new Collection();

    constructor()
    {
        super({ intents: 32767 });
    }

    channel_log = async (guildId: Snowflake, content: string, embed?: MessageEmbed, file?: MessageAttachment) =>
    {  
        let guild: Guild = await this.guilds.fetch(guildId);

        if (!guild) return;

        let channel_id: string = config.discord.guilds[guild.id]?.channels["Discord Logs"];

        if (!channel_id) return;

        let text_channel: NonThreadGuildBasedChannel | TextChannel = await guild.channels.fetch(channel_id);
            text_channel = text_channel as TextChannel;

        let date        = new Date().toUTCString();
        let timestamp   = date.match(/\d{2}:\d{2}:\d{2}/); // POGU!

        let message_payload: any = {
            content: `\`[${timestamp}]\` ${content}`,
        };

        if (embed) 
        {
            message_payload = { 
                ...message_payload,
                embeds: [embed],
            };
        }

        if (file)
        {
            message_payload = {
                ...message_payload,
                files: [file],
            };
        }

        await text_channel.send(message_payload);
    }

    mention_str = (user: User) => `${user} **${user.username}**#${user.discriminator} (${user.id})`;
    
    muted_role = (guildId: Snowflake) => config.discord.guilds[guildId]?.roles["Muted"];

    start = () =>
    {
        this.register_modules();

        this.login(config.discord.token);
    }

    import_file = async (path: string) =>
    {
        return (await import(path))?.default;
    }

    register_commands = async ({ guildId, commands }: ICommandOptions) =>
    {
        if (!guildId) return;

        let guild: Guild = (await this.guilds.fetch(guildId));
        
        let commands_result: ApplicationCommand[] = [...(await guild.commands.set(commands)).values()];

        for (let i = 0; i < commands_result.length; i++)
        {
            await commands_result[i].edit(<ApplicationCommandData>{
                defaultPermission: false
            });

            let mod_role_id: string = config.discord.guilds[guild.id]?.roles["Moderator"];

            await guild.commands.permissions.add({
                command: commands_result[i].id,
                permissions: [{
                    id: mod_role_id,
                    type: 'ROLE',
                    permission: true
                }]
            });
        }

        console.log(`[DEBUG] Registerd Guild: ${guild.name}`);
    }

    register_modules = async () =>
    {
        const slashCommands: ApplicationCommandDataResolvable[] = [];

        const commandFiles: string[] = await glob(`${__dirname}/../commands/*/*{.ts,.js}`);
    
        commandFiles.forEach(async (filePath: string) =>
        {
            const command: ICommandType = await this.import_file(filePath);

            if (!command.name) return;

            this.commands.set(command.name, command);

            slashCommands.push(command);
        });
        
        this.on("ready", async() =>
        {
            for (const guildId in config.discord.guilds)
            {   
                this.register_commands({ guildId, commands: slashCommands });
            }
        });

        const eventFiles: string[] = await glob(`${__dirname}/../events/*/*{.ts,.js}`);

        eventFiles.forEach(async (filePath: string) =>
        {
            const event: Event<keyof ClientEvents> = await this.import_file(filePath);

            this.on(event.name, event.run);
        });
    };
}