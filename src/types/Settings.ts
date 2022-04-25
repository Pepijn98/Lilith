interface Blizzard {
    id: string;
    secret: string;
}

interface Database {
    user: string;
    password: string;
    host: string;
    name: string;
}

interface BotLists {
    topgg: string;
    bod: string;
}

interface Webhook {
    id: string;
    token: string;
    pastebinKey: string;
}

export interface Settings {
    debug: boolean;
    appID: string;
    publicKey: string;
    token: string;
    owner: string;
    devGuildID: string;
    blizzard: Blizzard;
    database: Database;
    botLists: BotLists;
    webhook: Webhook;
}

export default Settings;
