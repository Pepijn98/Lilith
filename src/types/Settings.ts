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
    tgg: string;
    bod: string;
    dls: string;
    bfd: string;
    bgg: string;
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
    dbl: BotLists;
    webhook: Webhook;
}

export default Settings;
