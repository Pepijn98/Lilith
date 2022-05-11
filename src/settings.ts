import { Settings } from "./types/Settings";
import dotenv from "dotenv";
import path from "path";

const fileName = process.env.NODE_ENV === "development" ? ".env.development" : ".env";
let dotenvPath = path.join(process.cwd(), fileName);
if (path.parse(process.cwd()).name === "dist") {
    dotenvPath = path.join(process.cwd(), "..", fileName);
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
    appID: process.env.BOT_ID,
    publicKey: process.env.BOT_PUBLIC_KEY,
    token: process.env.BOT_TOKEN,
    owner: process.env.BOT_OWNER_ID,
    devGuildID: process.env.DEV_GUILD_ID,
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
    dbl: {
        tgg: process.env.DBL_TGG_TOKEN,
        bod: process.env.DBL_BOD_TOKEN,
        dls: process.env.DBL_DLS_TOKEN,
        bfd: process.env.DBL_BFD_TOKEN,
        bgg: process.env.DBL_BGG_TOKEN,
    },
    webhook: {
        id: process.env.WEBHOOK_ID,
        token: process.env.WEBHOOK_TOKEN,
        pastebinKey: process.env.PASTEBIN_KEY
    }
};

export default settings;
