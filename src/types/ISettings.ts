export interface BattleNet {
    id: string;
    secret: string;
}

export interface IDatabase {
    user: string;
    password: string;
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
