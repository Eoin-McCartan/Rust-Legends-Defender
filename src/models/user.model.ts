import { Snowflake } from "discord.js";

import mongoose from "mongoose";
import { Schema, Document } from "mongoose";

export interface IUser extends Document {
    discord_id: string;

    roles: { [key: string]: Array<Snowflake> };
};

const UserSchema: Schema = (
    new Schema(
        {
            discord_id: String,

            roles: {
                type: Object,
                default: {}
            }
        },
        { strict: false }
    )
)

export default mongoose.model<IUser>("User", UserSchema)