<div align="center">
    <img height="250" src="./assets/avatar-round.png">
</div>

# Lilith (WIP)
Diablo 3 discord bot \
Default prefix will be `;` \
Click [here][invite-link] to invite the bot

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
`<>` - required parameters \
If an acronym is provided for any option use that instead of the full name. \
For example: Europe's acronym is `eu` you'd do `;region eu` and **NOT** `;region europe`. \
Another example: Demon Hunter's acronym is `dh` so you'd do `;heroes dh` and **NOT** `;heroes demon hunter`.

| name    | parameters              | description                                                                                               |
|:--------|:------------------------|:----------------------------------------------------------------------------------------------------------|
| tag     | [battle-tag]            | set battle.net account name                                                                               |
| region  | [[region][locale-link]] | set your region                                                                                           |
| locale  | [[locale][locale-link]] | set the locale (setting locale will only change the requested data from the api and not the bot its self) |
| account |                         | get your account details                                                                                  |
| hero    | <hero_id>               | get a specific hero                                                                                       |
| heroes  | [[class][class-link]]   | get a specific hero                                                                                       |

# Regions and their corresponding locale(s)
| region        | Acronym | host                              | locales                                                                 |
|:--------------|:--------|:----------------------------------|:------------------------------------------------------------------------|
| North America | us      | https://us.api.blizzard.com/      | en_US <br> es_MX <br> pt_BR                                             |
| Europe        | eu      | https://eu.api.blizzard.com/      | en_GB <br> es_ES <br> fr_FR <br> ru_RU <br> de_DE <br> pt_PT <br> it_IT |
| Korea         | kr      | https://kr.api.blizzard.com/      | ko_KR                                                                   |
| Taiwan        | tw      | https://tw.api.blizzard.com/      | zh_TW                                                                   |
| China         | cn      | https://gateway.battlenet.com.cn/ | zh_CN                                                                   |

# Class list
| Class        | Acronym |
|:-------------|:--------|
| Demon Hunter | dh      |
| Necromancer  | necro   |
| Monk         | monk    |
| Brabarian    | barb    |
| Witch Doctor | wd      |
| Wizard       | wiz     |
| Cursader     | cru     |

[invite-link]: https://discord.com/oauth2/authorize?client_id=740897738983604284&scope=bot&permissions=379968
[locale-link]: https://github.com/Pepijn98/Lilith#regions-and-their-corresponding-locales
[class-link]: https://github.com/Pepijn98/Lilith#class-list
