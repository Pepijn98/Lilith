import "./utils/Extensions";
import path from "path";
import settings from "./settings";
import Lilith from "./utils/Lilith";
import EventLoader from "./utils/EventLoader";
import { Constants } from "eris";
import { SlashCreator, GatewayServer } from "slash-create";
import { postGuildCount } from "./utils/Helpers";

let botReady = false;

const client = new Lilith(settings.token, {
    autoreconnect: true,
    compress: true,
    defaultImageFormat: "webp",
    defaultImageSize: 2048,
    intents: Constants.Intents.guilds | Constants.Intents.guildEmojisAndStickers
});

const creator = new SlashCreator({
    applicationID: settings.appID,
    publicKey: settings.publicKey,
    token: settings.token,
    client
});

const eventLoader = new EventLoader(client);

creator.on("debug", (message) => client.logger.info("SLASH:DEBUG", message));
creator.on("warn", (message) => client.logger.warn("SLASH:WARN", message));
creator.on("error", (error) => client.logger.error("SLASH:ERROR", error));
creator.on("synced", () => client.logger.info("SLASH:SYNC", "Commands synced!"));
creator.on("commandRun", (command, _, ctx) => client.logger.info("SLASH:CMD", `${ctx.user.username}#${ctx.user.discriminator} (${ctx.user.id}) ran command ${command.commandName}`));
creator.on("commandRegister", (command) => client.logger.info(`CMD:${command.commandName.toUpperCase()}`, "Registered!"));
creator.on("commandError", (command, error) => client.logger.error(`CMD:${command.commandName.toUpperCase()}`, error));

creator
    .withServer(
        new GatewayServer((handler) =>
            client.on("rawWS", (event) => {
                if (event.t === "INTERACTION_CREATE") {
                    handler(event.d as any);
                }
            })
        )
    )
    .registerCommandsIn(path.join(__dirname, "commands"), [".ts"])
    .syncCommands();

client.on("ready", async () => {
    if (!botReady) {
        client.logger.ready(`Logged in as ${client.user.username}#${client.user.discriminator}`);
        client.editStatus("online", { name: "Diablo III", type: 0 });

        await postGuildCount(client);

        botReady = true;
    }
});

client.on("error", (e: any) => {
    if (e.code === 1001) {
        client.disconnect({ reconnect: true });
    } else {
        client.logger.error("ERROR", e);
    }
});

client.on("disconnect", () => {
    client.logger.warn("DISCONNECT", "Client disconnected");
});

client.on("shardResume", (id: number) => {
    const shard = client.shards.get(id);
    if (shard) {
        shard.editStatus("online", { name: "Diablo III", type: 0 });
    }
});

process.on("unhandledRejection", (reason: string | Error) => {
    client.logger.error("UNHANDLED_REJECTION", reason);
});

process.on("uncaughtException", (error) => {
    client.logger.error("UNCAUGHT_EXCEPTION", error);
});

process.on("SIGINT", () => {
    client.disconnect({ reconnect: false });
    process.exit(0);
});

async function main(): Promise<void> {
    await client.setup();

    // Load all events besides ready
    await eventLoader.load(path.join(__dirname, "events"));

    client.connect().catch((e) => client.logger.error("CONNECT", e));
}

main().catch((e) => client.logger.error("MAIN", e));
