import path from "path";
import dotenv from "dotenv";
import { Settings } from "./types/Settings";

let dotenvPath = path.join(process.cwd(), ".env");
if (path.parse(process.cwd()).name === "dist") {
    dotenvPath = path.join(process.cwd(), "..", ".env");
}
const { error, parsed } = dotenv.config({ path: dotenvPath });

if (error) {
    console.error(error);
    process.exit(0);
}

if (parsed) {
    for (const name in parsed) {
        if (!parsed[name]) {
            console.error(`Missing ${name} in .env`);
            process.exit(0);
        }
    }
}

const settings: Settings = {
    debug: String(process.env.DEBUG).toLowerCase() === "true",
    appID: process.env.DISCORD_APP_ID,
    publicKey: process.env.DISCORD_PUBLIC_KEY,
    token: process.env.DISCORD_BOT_TOKEN,
    owner: process.env.BOT_OWNER_ID,
    devGuildID: process.env.DEVELOPMENT_GUILD_ID,
    blizzard: {
        id: process.env.BLIZZARD_APP_ID,
        secret: process.env.BLIZZARD_SECRET
    },
    database: {
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        name: process.env.DB_NAME
    },
    botLists: {
        topgg: process.env.BOT_TOPGG_TOKEN,
        bod: process.env.BOT_BOD_TOKEN
    },
    webhook: {
        id: process.env.WEBHOOK_ID,
        token: process.env.WEBHOOK_TOKEN,
        pastebinKey: process.env.PASTEBIN_KEY
    }
};

export default settings;
