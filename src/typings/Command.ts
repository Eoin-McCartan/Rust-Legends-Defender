import { 
    ChatInputApplicationCommandData,
    CommandInteraction,
    CommandInteractionOptionResolver,
    GuildMember,
    PermissionResolvable
} from "discord.js";

import { RLClient } from "../structures/Client";

export interface RLInteraction extends CommandInteraction {
    member: GuildMember
};

interface Options {
    client: RLClient,
    interaction: CommandInteraction,
    args: CommandInteractionOptionResolver
};

type Run = (options: Options) => any;

export type CommandType = {
    userPermissions?: PermissionResolvable[];
    cooldown?: number;
    run: Run;
} & ChatInputApplicationCommandData;