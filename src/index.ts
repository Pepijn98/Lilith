// eslint-disable-next-line @typescript-eslint/no-var-requires
require("eris-additions")(require("eris"));

import "./utils/Extended";
import path from "path";
import settings from "./settings";
import Lilith from "./utils/Client";
import CommandHandler from "./utils/CommandHandler";
import CommandLoader from "./utils/CommandLoader";
import EventLoader from "./utils/EventLoader";
import Logger from "./utils/Logger";
// import Event from "./types/Event";
// import { promises as fs } from "fs";
import { isGuildChannel, loadPrefixes, isDMChannel } from "./utils/Utils";

let ready = false;

const logger = new Logger();
const client = new Lilith(logger, settings.token, { restMode: true });
const eventLoader = new EventLoader(client, logger);
const commandLoader = new CommandLoader(logger);
const commandHandler = new CommandHandler({ settings, client, logger });

async function main(): Promise<void> {
    await client.setup();

    // Load all events besides ready and messageCreate
    await eventLoader.load(path.join(__dirname, "events"));
    // const eventsDir = `${__dirname}/events`;
    // const files = await fs.readdir(eventsDir);
    // for (const file of files) {
    //     if (/\.(t|j)s$/iu.test(file)) {
    //         const event = new (await import(`${eventsDir}/${file}`)).default() as Event;
    //         logger.info("EVENTS", `Loaded ${event.name}`);
    //         client.on(event.name, (...args: any[]) => event.run(client, ...args));
    //     }
    // }

    client.on("ready", async () => {
        if (!ready) {
            // Load commands
            client.guildPrefixMap = await loadPrefixes();
            client.commands = await commandLoader.load(path.join(__dirname, "commands"));

            // Log some info
            logger.ready(`Logged in as ${client.user.tag}`);
            logger.ready(`Loaded [${client.commands.size}] commands`);

            // We're ready \o/
            ready = true;
        }

        client.editStatus("online", { name: "Diablo III", type: 0 });
    });

    // Handle commands
    client.on("messageCreate", async (msg) => {
        if (!ready) return; // Bot not ready yet
        if (!msg.author) return; // Probably system message
        if (msg.author.discriminator === "0000") return; // Probably a webhook
        if (msg.author.id === client.user.id) return; // Ignore our own messages

        client.stats.messagesSeen++;

        // Check if message was send in a guild channel
        if (isGuildChannel(msg.channel)) {
            const prefix = client.guildPrefixMap.get(msg.channel.guild.id) || settings.prefix;
            // If message starts with configured prefix handleCommand
            if (msg.content.startsWith(prefix)) {
                await commandHandler.handleCommand(msg, false);
            }
        } else if (isDMChannel(msg.channel) && msg.content.startsWith(settings.prefix)) {
            await commandHandler.handleCommand(msg, true);
        }
    });

    process.on("unhandledRejection", (reason) => {
        logger.error("UNHANDLED_REJECTION", reason as any);
    });

    process.on("SIGINT", () => {
        client.disconnect({ reconnect: false });
        process.exit(0);
    });

    // Connect to discord OwO
    client.connect().catch((e) => logger.error("CONNECT", e.stack));
}

main().catch((e) => logger.error("MAIN", e));
