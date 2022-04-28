import Config from "../types/db/Config";

import { Document, Model, Schema, model } from "mongoose";

export interface ConfigModel extends Config, Document {}

const ConfigSchema = new Schema<ConfigModel>({
    name: String,
    guilds: { type: [String] }
});

export const Configs: Model<ConfigModel> = model<ConfigModel>("Config", ConfigSchema);

export default Configs;
