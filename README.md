<div align="center">
    <img height="250" src="./assets/avatar-round.png">
</div>

# Lilith
Diablo 3 discord bot \
Click [here][invite-link] to invite the bot

<!-- # TODO (Must Have) -->

# TODO (Add Later)
- Create `DiabloError` class and return errors thrown by `Diablo#getHero` etc. as a response.
- request items
- character class/skills
- request season/era leaderboards

# Completed
- migrate to slash commands
- switch to typescript
- command handler
- set battle.net account name
- set region
- request specific hero from account
- request account
- changable prefix per guild

# Commands
`[]` - optional parameters \
`<>` - required parameters

| name | parameters | description | completed |
|:-|:-|:-|:-|
| tag | [[battle-tag][tag-link]] | set battle.net account name | yes |
| region | [[region][locale-link]] | set your region | yes |
| locale | [[locale][locale-link]] | set the locale (setting locale will only change the requested data from the api and not the bot its self) | yes |
| account | [<[region][locale-link]> <[battle-tag][tag-link]>] | get your account details | yes |
| hero | <id> [<[region][locale-link]> <[battle-tag][tag-link]>] | get a specific hero | yes |
| heroes | [[class][class-link]] [<[region][locale-link]> <[battle-tag][tag-link]>] | get a list of all your heroes | yes |
| setup || setup your account by specifying your battle tag, region and locale. <br> This is an interactive command and does not require any arguments | yes |

# Regions and their corresponding locale(s)
| region        | Acronym | host                              | locales                                                                 |
|:--------------|:--------|:----------------------------------|:------------------------------------------------------------------------|
| America       | us      | https://us.api.blizzard.com/      | en_US <br> es_MX <br> pt_BR                                             |
| Europe        | eu      | https://eu.api.blizzard.com/      | en_GB <br> es_ES <br> fr_FR <br> ru_RU <br> de_DE <br> pt_PT <br> it_IT |
| Korea         | kr      | https://kr.api.blizzard.com/      | ko_KR                                                                   |
| Taiwan        | tw      | https://tw.api.blizzard.com/      | zh_TW                                                                   |
| China         | cn      | https://gateway.battlenet.com.cn/ | zh_CN                                                                   |

# Links
Thank you to [eris](https://github.com/abalabahaha/eris) for the awesome discord api library and [slash-create](https://github.com/Snazzah/slash-create) for making migrating to slash commands super easy! \
Check out my website: [vdbroek.dev](https://vdbroek.dev) \
[![discord](https://discordapp.com/api/v6/guilds/240059867744698368/widget.png?style=banner2)](https://discord.gg/qqtrrMj)


[invite-link]: https://discord.com/api/oauth2/authorize?client_id=740897738983604284&permissions=412384349248&scope=applications.commands%20bot
[locale-link]: https://github.com/Pepijn98/Lilith#regions-and-their-corresponding-locales
[class-link]: https://github.com/Pepijn98/Lilith#class-list
[tag-link]: https://eu.battle.net/support/en/article/75767
