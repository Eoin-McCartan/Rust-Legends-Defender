import mongoose from "mongoose";
import { Schema, Document } from "mongoose";

export interface IMute extends Document {
    guild: string;

    discord_id: string;

    moderator_id: string;

    expires: Date;
}

const MuteSchema: Schema = (
    new Schema(
        {
            discord_id: String,

            moderator_id: String,

            expires: Date
        },
        { strict: false }
    )
)

export default mongoose.model<IMute>("Mute", MuteSchema)