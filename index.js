const axios = require("axios");
const settings = require("./settings");
const baseUrl = "https://us.api.blizzard.com/";

let token = null;
let expiresIn = null;
let lastRequest = null;

async function requestToken() {
    const response = await axios.get("https://us.battle.net/oauth/token", {
        params: {
            "client_id": settings.clientId,
            "client_secret": settings.clientSecret,
            "grant_type": "client_credentials"
        }
    });

    switch (response.data.token_type) {
        case "bearer":
            expiresIn = response.data.expires_in
            token = response.data.access_token
            lastRequest = Date.now()
            break;
    
        default:
            break;
    }
}

async function requestAct(number) {
    const { data } = await axios.get(baseUrl + "d3/data/act/" + number, {
        params: {
            "locale": "en_US",
            "access_token": token
        },
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json;charset=utf-8"
            
        }
    });
    return data;
}

async function main() {
    // Request access token
    await requestToken();

    // Access token expires after 24 hours so check if it's still valid
    // If not valid request new token
    setInterval(async () => {
        if ((lastRequest - Date.now()) > expiresIn)  {
            console.log("requesting new token");
            await requestToken();
        }
    }, 1800000);

    // Get act data
    const data = await requestAct(1);
    console.log(data);
}

main().catch(console.error);