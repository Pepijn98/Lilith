export interface BattleNet {
    clientId: string;
    clientSecret: string;
}

export interface IDatabase {
    host: string;
    port: number;
    name: string;
}

export interface ISettings {
    token: string;
    owner: string;
    prefix: string;
    battlenet: BattleNet;
    database: IDatabase;
}
