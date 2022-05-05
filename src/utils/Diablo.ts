import Account from "../types/diablo/Account";
import Hero from "../types/diablo/Hero";
import Interval from "yukikaze";
import Logger from "./Logger";
import axios from "axios";
import settings from "../settings";

import { Auth, AuthResponse } from "../types/diablo/Auth";
import { baseUrl, defaultLocales, getDBUser } from "./Helpers";

class Diablo {
    timeout = 1000 * 60 * 5; // Check every 5 minutes
    hasError = 0;

    logger: Logger;
    interval: Interval;
    auth!: Auth;

    constructor(logger: Logger) {
        this.logger = logger;

        this.interval = new Interval();
        this.interval.run(async () => await this.updateToken(), this.timeout, true);
    }

    async updateToken(): Promise<void> {
        try {
            this.logger.debug("REQUEST_TOKEN", "Making api request...");
            // prettier-ignore
            const response = await axios.post<AuthResponse>("https://eu.battle.net/oauth/token", {}, {
                params: {
                    client_id: settings.blizzard.id,
                    client_secret: settings.blizzard.secret,
                    grant_type: "client_credentials"
                }
            });

            switch (response.data.token_type) {
                case "bearer":
                    const expiresAt = new Date();
                    expiresAt.setSeconds(expiresAt.getSeconds() + response.data.expires_in);
                    this.auth = {
                        token_type: response.data.token_type,
                        expires_in: response.data.expires_in,
                        access_token: response.data.access_token,
                        expires_at: expiresAt
                    };
                    this.logger.debug("REQUEST_TOKEN", "Request successful");
                    break;
                default:
                    this.logger.error("REQUEST_TOKEN", "Invalid token type", true);
                    break;
            }

            // Reset error after successful request
            this.hasError = 0;
        } catch (e) {
            // // Increment error after failed request
            // this.hasError++;
            // // Reset error count if error is a ECONNRESET, ETIMEDOUT or ENOTFOUND, we can ignore it.
            // // prettier-ignore
            // if (
            //     e.toString().includes("ECONNRESET") ||
            //     e.toString().includes("ETIMEDOUT") ||
            //     e.toString().includes("ENOTFOUND")
            // ) {
            //     this.hasError = 0;
            // }
            // // Only log error on the first failed attempt
            // if (this.hasError === 1) {
            //     this.logger.error("REQUEST_TOKEN", e, true);
            // }
        }
    }

    async getAccount(userID: string): Promise<Account> {
        const user = await getDBUser(userID);
        if (!user) {
            throw Error("User not found, use `/setup` to get started");
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
                access_token: this.auth.access_token
            },
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json;charset=utf-8"
            }
        });

        return data;
    }

    async getAccountByTag(region: string, battleTag: string): Promise<Account> {
        let apiUrl = baseUrl.replace(/\{REGION\}/giu, region);
        if (region === "cn") {
            apiUrl = "https://gateway.battlenet.com.cn";
        }

        const { data } = await axios.get<Account>(`${apiUrl}/d3/profile/${encodeURIComponent(battleTag)}/`, {
            params: {
                locale: defaultLocales[region],
                access_token: this.auth.access_token
            },
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json;charset=utf-8"
            }
        });

        return data;
    }

    async getHero(userID: string, heroID: string): Promise<Hero> {
        const user = await getDBUser(userID);
        if (!user) {
            throw Error("User not found, use `/setup` to get started");
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
                access_token: this.auth.access_token
            },
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json;charset=utf-8"
            }
        });

        return data;
    }

    async getHeroByTag(heroID: string, region: string, battleTag: string): Promise<Hero> {
        let apiUrl = baseUrl.replace(/\{REGION\}/giu, region);
        if (region === "cn") {
            apiUrl = "https://gateway.battlenet.com.cn";
        }

        const { data } = await axios.get<Hero>(`${apiUrl}/d3/profile/${encodeURIComponent(battleTag)}/hero/${heroID}`, {
            params: {
                locale: defaultLocales[region],
                access_token: this.auth.access_token
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
