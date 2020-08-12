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
import { isGuildChannel, loadPrefixes, isDMChannel } from "./utils/Utils";

let ready = false;

const logger = new Logger();
const client = new Lilith(logger, settings.token, { restMode: true });
const eventLoader = new EventLoader(client);
const commandLoader = new CommandLoader(client);
const commandHandler = new CommandHandler(client);

async function main(): Promise<void> {
    await client.setup();

    // Load all events besides ready and messageCreate
    await eventLoader.load(path.join(__dirname, "events"));

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
        let prefix = settings.prefix;
        if (isGuildChannel(msg.channel)) {
            prefix = msg.channel.guild.prefix;
            // If message starts with configured prefix handleCommand
            if (msg.content.startsWith(prefix)) {
                await commandHandler.handleCommand(msg, prefix, false);
            }
        } else if (isDMChannel(msg.channel) && msg.content.startsWith(settings.prefix)) {
            await commandHandler.handleCommand(msg, prefix, true);
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
