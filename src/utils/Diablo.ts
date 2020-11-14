import axios from "axios";
import Interval from "yukikaze";
import settings from "~/settings";
import Account from "~/types/diablo/Account";
import Hero from "~/types/diablo/Hero";
import Logger from "./Logger";
import { getDBUser, baseUrl, defaultLocaleMap } from "./Utils";

interface AuthResponse {
    token_type: string;
    expires_in: number;
    access_token: string;
}

class Diablo {
    logger: Logger;

    token!: string;
    lastModified!: number;

    constructor(logger: Logger) {
        this.logger = logger;

        const hours = 12;
        const interval = new Interval();
        interval.run(async () => await this.requestToken(), hours * 60 * 60 * 1000, true);
    }

    async requestToken(): Promise<void> {
        try {
            const response = await axios.get<AuthResponse>("https://eu.battle.net/oauth/token", {
                params: {
                    client_id: settings.battlenet.id,
                    client_secret: settings.battlenet.secret,
                    grant_type: "client_credentials"
                }
            });

            switch (response.data.token_type) {
                case "bearer":
                    this.token = response.data.access_token;
                    this.lastModified = Date.now();
                    break;
                default:
                    this.logger.error("[REQUEST_TOKEN]", "Invalid token type", true);
                    break;
            }
            this.logger.error("[REQUEST_TOKEN]", "Invalid token type", true);
        } catch (e) {
            this.logger.error("[REQUEST_TOKEN]", e, true);
        }
    }

    async validateToken(): Promise<void> {
        // If last modified is more than 12 hours ago, get a new access token
        if (((Date.now() - this.lastModified) / 1000 / 60 / 60) > 12) {
            await this.requestToken();
        }
    }

    async getAccount(userID: string): Promise<Account> {
        await this.validateToken();

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
                access_token: this.token
            },
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json;charset=utf-8"
            }
        });

        return data;
    }

    async getAccountByTag(region: string, battleTag: string): Promise<Account> {
        await this.validateToken();

        let apiUrl = baseUrl.replace(/\{REGION\}/giu, region);
        if (region === "cn") {
            apiUrl = "https://gateway.battlenet.com.cn";
        }

        const { data } = await axios.get<Account>(`${apiUrl}/d3/profile/${encodeURIComponent(battleTag)}/`, {
            params: {
                locale: defaultLocaleMap[region],
                access_token: this.token
            },
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json;charset=utf-8"
            }
        });

        return data;
    }

    async getHero(userID: string, heroID: string): Promise<Hero> {
        await this.validateToken();

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
                access_token: this.token
            },
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json;charset=utf-8"
            }
        });

        return data;
    }

    async getHeroByTag(heroID: string, region: string, battleTag: string): Promise<Hero> {
        await this.validateToken();

        let apiUrl = baseUrl.replace(/\{REGION\}/giu, region);
        if (region === "cn") {
            apiUrl = "https://gateway.battlenet.com.cn";
        }

        const { data } = await axios.get<Hero>(`${apiUrl}/d3/profile/${encodeURIComponent(battleTag)}/hero/${heroID}`, {
            params: {
                locale: defaultLocaleMap[region],
                access_token: this.token
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
