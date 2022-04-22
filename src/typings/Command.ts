import { 
    ChatInputApplicationCommandData,
    CommandInteraction,
    CommandInteractionOptionResolver,
    PermissionResolvable
} from "discord.js";

import { RLClient } from "../structures/Client";

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