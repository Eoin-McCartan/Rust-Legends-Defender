import { 
    ChatInputApplicationCommandData,
    CommandInteraction,
    CommandInteractionOptionResolver,
    PermissionResolvable
} from "discord.js";

import { RLClient } from "../structures/Client";

interface IClientOptions {
    client: RLClient,
    interaction: CommandInteraction,
    args: CommandInteractionOptionResolver
};

type Run = (options: IClientOptions) => any;

export type ICommandType = {
    userPermissions?: PermissionResolvable[];
    cooldown?: number;
    run: Run;
} & ChatInputApplicationCommandData;