interface BattleNet {
    id: string;
    secret: string;
}

interface Database {
    user: string;
    password: string;
    host: string;
    port: number;
    name: string;
}

interface BotLists {
    topgg: string;
    bod: string;
}

interface Webhook {
    id: string;
    token: string;
}

export interface Settings {
    token: string;
    owner: string;
    prefix: string;
    battlenet: BattleNet;
    database: Database;
    botLists: BotLists;
    webhook: Webhook;
}

export default Settings;
