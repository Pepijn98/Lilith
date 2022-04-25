import path from "path";
import Lilith from "./Lilith";
import Logger from "~/utils/Logger";
import Event from "~/types/Event";
import { promises as fs } from "fs";

export default class EventLoader {
    client: Lilith;
    logger: Logger;

    constructor(client: Lilith) {
        this.client = client;
        this.logger = client.logger;
    }

    /** Load all the commands */
    async load(eventsDir: string): Promise<void> {
        const files = await fs.readdir(eventsDir);
        for (const file of files) {
            if (/\.(t|j)s$/iu.test(file)) {
                const event = new (await import(path.join(eventsDir, file))).default() as Event;
                this.logger.info("EVENTS", `Loaded even ${event.name}`);
                this.client.on(event.name, (...args: any[]) => event.run(this.client, ...args));
            }
        }
    }
}
