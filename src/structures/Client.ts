import mongoose from "mongoose";
import Collection from "@kurozero/collection";
import Yukikaze from "yukikaze";
import settings from "~/settings";
import Command from "~/Command";
import Diablo from "~/utils/Diablo";
import Logger from "~/utils/Logger";
import { Client, ClientOptions } from "eris";
import { ICommandStats } from "~/types/Options";

const hours = 0.5;
const interval = new Yukikaze();

export default class Lilith extends Client {
    logger: Logger;
    commands: Collection<Command>;
    stats: ICommandStats;
    ready = false;

    diablo!: Diablo;
    accessToken!: string;
    expiresIn!: number;
    lastRequest!: number;

    constructor(logger: Logger, token: string, options: ClientOptions) {
        super(token, options);

        this.logger = logger;
        this.commands = new Collection(Command);
        this.stats = {
            commandsExecuted: 0,
            messagesSeen: 0,
            commandUsage: {}
        };

        // Access token expires after 24 hours so check if it's still valid every 30 minutes
        // If not valid request new token
        interval.run(async () => {
            if (this.lastRequest && this.expiresIn) {
                if (this.lastRequest - Date.now() > this.expiresIn) {
                    this.logger.info("TOKEN_REQUEST", "requesting new token");
                    try {
                        const data = await Diablo.requestToken();
                        this.accessToken = data.token;
                        this.expiresIn = data.expiresIn;
                        this.lastRequest = data.lastRequest;
                        this.diablo.token = this.accessToken;
                    } catch (e) {
                        this.logger.error("TOKEN_REQUEST", e);
                    }
                }
            }
        }, hours * 60 * 60 * 1000);
    }

    async setup(): Promise<void> {
        try {
            await mongoose.connect(
                `mongodb://${settings.database.user}:${settings.database.password}@${settings.database.host}:${settings.database.port}/${settings.database.name}`,
                { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }
            );
            const data = await Diablo.requestToken();
            this.accessToken = data.token;
            this.expiresIn = data.expiresIn;
            this.lastRequest = data.lastRequest;
            this.diablo = new Diablo(this.accessToken);
        } catch (e) {
            this.logger.error("SETUP", e);
        }
    }
}
