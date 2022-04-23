import { 
    ChatInputApplicationCommandData,
    CommandInteraction,
    CommandInteractionOptionResolver,
    GuildMember,
    PermissionResolvable
} from "discord.js";

import { RLClient } from "../structures/Client";

export interface ICommandInteraction extends CommandInteraction {
    member: GuildMember
};

interface IClientOptions {
    client: RLClient,
    interaction: ICommandInteraction,
    args: CommandInteractionOptionResolver
};

type Run = (options: IClientOptions) => any;

export type ICommandType = {
    userPermissions?: PermissionResolvable[];
    cooldown?: number;
    run: Run;
} & ChatInputApplicationCommandData;