import axios from "axios";
import settings from "~/settings";
import Account from "~/types/diablo/Account";
import Hero from "~/types/diablo/Hero";
import { User } from "eris";
import { getDBUser, baseUrl } from "./Utils";

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

    async getAccount(user: User): Promise<Account> {
        const dbUser = await getDBUser(user.id);
        if (!dbUser) {
            throw Error("User not found, use `;setup` to get started");
        }

        if (!dbUser.region) {
            throw Error("No region set");
        }

        if (!dbUser.locale) {
            throw Error("No locale set");
        }

        if (!dbUser.battleTag) {
            throw Error("No battle tag set");
        }

        const apiUrl = baseUrl.replace(/\{REGION\}/giu, dbUser.region);
        const { data } = await axios.get<Account>(apiUrl + `/d3/profile/${encodeURIComponent(dbUser.battleTag)}/`, {
            params: {
                locale: dbUser.locale,
                access_token: this.token
            },
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json;charset=utf-8"
            }
        });
        return data;
    }

    async getHero(user: User, id: string): Promise<Hero> {
        const dbUser = await getDBUser(user.id);
        if (!dbUser) {
            throw Error("User not found, use `;setup` to get started");
        }

        if (!dbUser.region) {
            throw Error("No region set");
        }

        if (!dbUser.locale) {
            throw Error("No locale set");
        }

        if (!dbUser.battleTag) {
            throw Error("No battle tag set");
        }

        const apiUrl = baseUrl.replace(/\{REGION\}/giu, dbUser.region);
        const { data } = await axios.get<Hero>(apiUrl + `/d3/profile/${encodeURIComponent(dbUser.battleTag)}/hero/${id}`, {
            params: {
                locale: dbUser.locale,
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
