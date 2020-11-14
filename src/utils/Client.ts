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

    constructor(logger: Logger, token: string, options: ClientOptions) {
        super(token, options);

        this.logger = logger;
        this.commands = new Collection(Command);
        this.stats = {
            commandsExecuted: 0,
            messagesSeen: 0,
            commandUsage: {}
        };
    }

    async setup(): Promise<void> {
        try {
            await mongoose.connect(
                `mongodb://${settings.database.user}:${settings.database.password}@${settings.database.host}:${settings.database.port}/${settings.database.name}`,
                { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false }
            );
            this.diablo = new Diablo(this.logger);
        } catch (e) {
            this.logger.error("SETUP", e);
        }
    }
}
