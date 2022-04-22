import { ICommandType } from "../typings/Command";

export class Command
{
    constructor(options: ICommandType)
    {
        Object.assign(this, options);
    }
}