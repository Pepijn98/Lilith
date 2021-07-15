import mongoose from "mongoose";
import Collection from "@kurozero/collection";
import settings from "~/settings";
import Command from "~/Command";
import Diablo from "~/utils/Diablo";
import Logger from "~/utils/Logger";
import { Client, ClientOptions } from "eris";
import { CommandStats } from "~/types/Options";

export default class Lilith extends Client {
    logger: Logger;
    commands: Collection<Command>;
    stats: CommandStats;
    ready = false;

    diablo!: Diablo;

    constructor(token: string, options: ClientOptions) {
        super(token, options);

        this.logger = new Logger(this);
        this.commands = new Collection(Command);
        this.stats = {
            commandsExecuted: 0,
            messagesSeen: 0,
            commandUsage: {}
        };
    }

    async setup(): Promise<void> {
        try {
            await mongoose.connect(`mongodb+srv://${settings.database.user}:${settings.database.password}@${settings.database.host}/?retryWrites=true&w=majority`, {
                dbName: settings.database.name,
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex: true,
                useFindAndModify: false
            });
            this.diablo = new Diablo(this.logger);
        } catch (e) {
            this.logger.error("SETUP", e);
        }
    }
}
