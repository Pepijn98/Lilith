import mongoose from "mongoose";
import settings from "../settings";
import Diablo from "../utils/Diablo";
import Logger from "../utils/Logger";
import { Client, ClientOptions } from "eris";

export default class Lilith extends Client {
    ready = false;

    logger: Logger;
    diablo!: Diablo;

    constructor(token: string, options: ClientOptions) {
        super(token, options);

        this.logger = new Logger(this);
    }

    async setup(): Promise<void> {
        try {
            this.diablo = new Diablo(this.logger);
            await mongoose.connect(`mongodb+srv://${settings.database.user}:${settings.database.password}@${settings.database.host}/?retryWrites=true&w=majority`, {
                dbName: settings.database.name,
            });
        } catch (e) {
            this.logger.error("SETUP", e);
        }
    }
}
