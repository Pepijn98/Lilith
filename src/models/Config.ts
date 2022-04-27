import ConfigType from "../types/db/Config";
import { Document, Schema, Model, model } from "mongoose";

export interface ConfigModel extends ConfigType, Document {}

const ConfigSchema = new Schema<ConfigModel>({
    name: String,
    guilds: { type: [String] }
});

export const Config: Model<ConfigModel> = model<ConfigModel>("Config", ConfigSchema);

export default Config;
