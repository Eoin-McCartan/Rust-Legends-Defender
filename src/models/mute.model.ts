import mongoose from "mongoose";
import { Schema, Document } from "mongoose";

export interface IMute extends Document {
    type: string;

    guild_id: string;

    discord_id: string;

    moderator_id: string;

    expires: number;
}

const MuteSchema: Schema = (
    new Schema(
        {
            type: String,

            guild_id: String,

            discord_id: String,

            moderator_id: String,

            expires: Number
            
        },
        { strict: false }
    )
)

export default mongoose.model<IMute>("Mute", MuteSchema)