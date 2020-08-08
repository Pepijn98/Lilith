import Guild from "~/types/mongo/Guild";
import { Document, Schema, Model, model } from "mongoose";

export interface GuildModel extends Guild, Document {}

const GuildSchema = new Schema<GuildModel>({
    uid: { unique: true, type: String },
    prefix: String
});

export const Guilds: Model<GuildModel> = model<GuildModel>("Guild", GuildSchema);

export default Guilds;
