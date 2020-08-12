import axios from "axios";
import settings from "~/settings";
import Account from "~/types/diablo/Account";
import Hero from "~/types/diablo/Hero";
import { getDBUser, baseUrl, defaultLocaleMap } from "./Utils";

interface AuthData {
    expiresIn: number;
    token: string;
    lastRequest: number;
}

interface AuthResponse {
    token_type: string;
    expires_in: number;
    access_token: string;
}

class Diablo {
    token: string;

    constructor(token: string) {
        this.token = token;
    }

    static requestToken(): Promise<AuthData> {
        return new Promise((resolve, reject) => {
            axios
                .get<AuthResponse>("https://eu.battle.net/oauth/token", {
                    params: {
                        client_id: settings.battlenet.id,
                        client_secret: settings.battlenet.secret,
                        grant_type: "client_credentials"
                    }
                })
                .then((response) => {
                    switch (response.data.token_type) {
                        case "bearer":
                            resolve({
                                expiresIn: response.data.expires_in,
                                token: response.data.access_token,
                                lastRequest: Date.now()
                            });
                            break;
                        default:
                            reject(Error("Invalid token type"));
                            break;
                    }
                    reject(Error("Invalid token type"));
                })
                .catch(reject);
        });
    }

    async getAccount(userID: string): Promise<Account> {
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
