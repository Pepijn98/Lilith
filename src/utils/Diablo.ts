import axios from "axios";
import settings from "~/settings";
import Account from "~/types/diablo/Account";
import Hero from "~/types/diablo/Hero";
import Logger from "./Logger";
import { AccessToken, ClientCredentials } from "simple-oauth2";
import { getDBUser, baseUrl, defaultLocaleMap } from "./Utils";

interface AuthResponse {
    token_type: string;
    expires_in: number;
    access_token: string;
    expires_at: Date;
}

const oauth2 = new ClientCredentials({
    client: {
        id: settings.battlenet.id,
        secret: settings.battlenet.secret
    },
    auth: {
        tokenHost: "https://eu.battle.net"
    }
});

class Diablo {
    logger: Logger;

    auth?: AccessToken;
    lastModified!: number;

    constructor(logger: Logger) {
        this.logger = logger;
    }

    async getToken(): Promise<AuthResponse> {
        if (!this.auth) {
            const auth = await oauth2.getToken({});
            this.auth = oauth2.createToken(auth);
            return this.auth.token.token;
        }

        if (this.auth.expired()) {
            this.auth = await this.auth.refresh();
            return this.auth.token.token;
        }

        return this.auth.token.token;
    }

    async getAccount(userID: string): Promise<Account> {
        const response = await this.getToken();

        const user = await getDBUser(userID);
        if (!user) {
            throw Error("User not found, use `;setup` to get started");
        }

        if (!user.region) {
            throw Error("No region set");
        }

        if (!user.locale) {
            throw Error("No locale set");
        }

        if (!user.battleTag) {
            throw Error("No battle tag set");
        }

        let apiUrl = baseUrl.replace(/\{REGION\}/giu, user.region);
        if (user.region === "cn") {
            apiUrl = "https://gateway.battlenet.com.cn";
        }

        const { data } = await axios.get<Account>(`${apiUrl}/d3/profile/${encodeURIComponent(user.battleTag)}/`, {
            params: {
                locale: user.locale,
                access_token: response.access_token
            },
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json;charset=utf-8"
            }
        });

        return data;
    }

    async getAccountByTag(region: string, battleTag: string): Promise<Account> {
        const response = await this.getToken();

        let apiUrl = baseUrl.replace(/\{REGION\}/giu, region);
        if (region === "cn") {
            apiUrl = "https://gateway.battlenet.com.cn";
        }

        const { data } = await axios.get<Account>(`${apiUrl}/d3/profile/${encodeURIComponent(battleTag)}/`, {
            params: {
                locale: defaultLocaleMap[region],
                access_token: response.access_token
            },
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json;charset=utf-8"
            }
        });

        return data;
    }

    async getHero(userID: string, heroID: string): Promise<Hero> {
        const response = await this.getToken();

        const user = await getDBUser(userID);
        if (!user) {
            throw Error("User not found, use `;setup` to get started");
        }

        if (!user.region) {
            throw Error("No region set");
        }

        if (!user.locale) {
            throw Error("No locale set");
        }

        if (!user.battleTag) {
            throw Error("No battle tag set");
        }

        let apiUrl = baseUrl.replace(/\{REGION\}/giu, user.region);
        if (user.region === "cn") {
            apiUrl = "https://gateway.battlenet.com.cn";
        }

        const { data } = await axios.get<Hero>(`${apiUrl}/d3/profile/${encodeURIComponent(user.battleTag)}/hero/${heroID}`, {
            params: {
                locale: user.locale,
                access_token: response.access_token
            },
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json;charset=utf-8"
            }
        });

        return data;
    }

    async getHeroByTag(heroID: string, region: string, battleTag: string): Promise<Hero> {
        const response = await this.getToken();

        let apiUrl = baseUrl.replace(/\{REGION\}/giu, region);
        if (region === "cn") {
            apiUrl = "https://gateway.battlenet.com.cn";
        }

        const { data } = await axios.get<Hero>(`${apiUrl}/d3/profile/${encodeURIComponent(battleTag)}/hero/${heroID}`, {
            params: {
                locale: defaultLocaleMap[region],
                access_token: response.access_token
            },
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json;charset=utf-8"
            }
        });

        return data;
    }
}

export default Diablo;
