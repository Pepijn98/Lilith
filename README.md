<div align="center">
    <img height="250" src="./assets/avatar-round.png">
</div>

# Lilith (WIP)
Diablo 3 discord bot \
Default prefix will be `;`
Click [here](https://discord.com/oauth2/authorize?client_id=740897738983604284&scope=bot&permissions=379968) to invite the bot

# TODO (Must Have)
- ~~switch to typescript~~
- ~~command handler~~
- set battle.net account name
- set region
- request account
- request specific hero from account

# TODO (Add Later)
- request items
- character class/skills
- request season/era leaderboards
- changable prefix per guild

# Commands
`[]` - optional parameters \
`<>` - required parameters

| name | parameters | description |
|:-|:-|:-|
| tag | [battle-tag] | set battle.net account name |
| region | [us/eu/kr/tw/cn] | set your region |
| locale | [locale] | set the locale (setting locale will only change the requested data from the api and not the bot its self) |
| account || get your account details |
| hero | <hero_id> | get a specific hero |

# Regions and their corresponding locale(s)
| region | host | locales |
|:-|:-|:-|
| North America | https://us.api.blizzard.com/ | en_US <br> es_MX <br> pt_BR |
| Europe | https://eu.api.blizzard.com/ | en_GB <br> es_ES <br> fr_FR <br> ru_RU <br> de_DE <br> pt_PT <br> it_IT |
| Korea | https://kr.api.blizzard.com/ | ko_KR |
| Taiwan | https://tw.api.blizzard.com/ | zh_TW |
| China | https://gateway.battlenet.com.cn/ | zh_CN |
