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

export interface Settings {
    token: string;
    owner: string;
    prefix: string;
    battlenet: BattleNet;
    database: Database;
}

export default Settings;
