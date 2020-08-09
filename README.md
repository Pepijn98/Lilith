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
- ~~set battle.net account name~~
- ~~set region~~
- ~~request specific hero from account~~
- request account

# TODO (Add Later)
- request items
- character class/skills
- request season/era leaderboards
- ~~changable prefix per guild~~

# Commands
`[]` - optional parameters \
`<>` - required parameters \

| name | parameters | description | completed |
|:-|:-|:-|:-|
| tag | [battle-tag] | set battle.net account name | no |
| region | [[region][locale-link]] | set your region | no |
| locale | [[locale][locale-link]] | set the locale (setting locale will only change the requested data from the api and not the bot its self) | no |
| account || get your account details | no |
| hero | <hero_id> | get a specific hero | yes |
| heroes | [[class][class-link]] | get a list of all your heroes | yes |
| setup || setup your account by specifying your battle tag, region and locale. <br> This is an interactive command and does not require any arguments | yes |
| prefix || set custom prefix for the server (requires the user to have the manage server permission) | yes |

# Regions and their corresponding locale(s)
| region        | Acronym | host                              | locales                                                                 |
|:--------------|:--------|:----------------------------------|:------------------------------------------------------------------------|
| North America | us      | https://us.api.blizzard.com/      | en_US <br> es_MX <br> pt_BR                                             |
| Europe        | eu      | https://eu.api.blizzard.com/      | en_GB <br> es_ES <br> fr_FR <br> ru_RU <br> de_DE <br> pt_PT <br> it_IT |
| Korea         | kr      | https://kr.api.blizzard.com/      | ko_KR                                                                   |
| Taiwan        | tw      | https://tw.api.blizzard.com/      | zh_TW                                                                   |
| China         | cn      | https://gateway.battlenet.com.cn/ | zh_CN                                                                   |

# Class list
| Class        | Option               |
|:-------------|:---------------------|
| Demon Hunter | dh, demon-hunter     |
| Necromancer  | necro, necromancer   |
| Monk         | monk                 |
| Brabarian    | barb, barbarian      |
| Witch Doctor | wd, witch-doctor     |
| Wizard       | wiz, wizard          |
| Cursader     | cru, sader, crusader |

[invite-link]: https://discord.com/oauth2/authorize?client_id=740897738983604284&scope=bot&permissions=388160
[locale-link]: https://github.com/Pepijn98/Lilith#regions-and-their-corresponding-locales
[class-link]: https://github.com/Pepijn98/Lilith#class-list
