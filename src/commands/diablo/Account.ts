import Command from "~/Command";
import CommandContext from "~/types/CommandContext";
import EmbedPaginator from "eris-pagination";
import { Message, EmbedOptions } from "eris";
import Lilith from "~/utils/Client";
import { round, classImageMap, classColorMap, regions, rbattleTag } from "~/utils/Utils";
import Account from "~/types/diablo/Account";
import Hero from "~/types/diablo/Hero";

export default class extends Command {
    client: Lilith;

    constructor(ctx: CommandContext) {
        super({
            name: "account",
            description: "Get details about your d3 account",
            usage: "account [<region> <battleTag>]",
            example: "account eu Kurozero#21247",
            category: ctx.category
        });

        this.client = ctx.client;
    }

    async run(msg: Message, args: string[]): Promise<void> {
        let account: Account;
        let lastPlayed: Hero;

        if (args.length >= 2) {
            const region = args[0].trim();
            const tag = args[1].trim();

            if (!regions.includes(region)) {
                msg.channel.createMessage("Invalid region");
                return;
            }

            if (!rbattleTag.test(tag)) {
                msg.channel.createMessage("Invalid battle tag");
                return;
            }

            account = await this.client.diablo.getAccountByTag(region, tag);
            lastPlayed = await this.client.diablo.getHeroByTag(account.lastHeroPlayed.toString(), region, tag);
        } else {
            account = await this.client.diablo.getAccount(msg.author.id);
            lastPlayed = await this.client.diablo.getHero(msg.author.id, account.lastHeroPlayed.toString());
        }

        const embeds: EmbedOptions[] = [
            {
                title: account.battleTag,
                color: classColorMap[lastPlayed.class],
                timestamp: new Date(account.lastUpdated * 1000),
                footer: {
                    text: "Last Played"
                },
                fields: [
                    {
                        name: "Paragon Level",
                        value: account.paragonLevel.toString(),
                        inline: true
                    },
                    {
                        name: "Paragon Level Seasonal",
                        value: account.paragonLevelSeason.toString(),
                        inline: true
                    },
                    {
                        name: "\u200B",
                        value: "\u200B",
                        inline: true
                    },
                    {
                        name: "Paragon Level Hardcore",
                        value: account.paragonLevelHardcore.toString(),
                        inline: true
                    },
                    {
                        name: "Paragon Level Hardcore Seasonal",
                        value: account.paragonLevelSeasonHardcore.toString(),
                        inline: true
                    },
                    {
                        name: "\u200B",
                        value: "\u200B",
                        inline: true
                    },
                    {
                        name: "Guild",
                        value: account.guildName ? account.guildName : "-",
                        inline: false
                    },
                    {
                        name: "Kills",
                        value: `Elites: ${account.kills.elites}\nMonsters: ${account.kills.monsters}\nHardcore: ${account.kills.hardcoreMonsters}`,
                        inline: false
                    }
                ]
            },
            {
                title: "Time Played",
                color: classColorMap[lastPlayed.class],
                fields: [
                    {
                        name: "Demon Hunter",
                        value: `${round(account.timePlayed["demon-hunter"] * 100, 2)}%`,
                        inline: true
                    },
                    {
                        name: "\u200B",
                        value: "\u200B",
                        inline: true
                    },
                    {
                        name: "Barbarian",
                        value: `${round(account.timePlayed.barbarian * 100, 2)}%`,
                        inline: true
                    },
                    {
                        name: "Witch Doctor",
                        value: `${round(account.timePlayed["witch-doctor"] * 100, 2)}%`,
                        inline: true
                    },
                    {
                        name: "\u200B",
                        value: "\u200B",
                        inline: true
                    },
                    {
                        name: "Necromancer",
                        value: `${round(account.timePlayed.necromancer * 100, 2)}%`,
                        inline: true
                    },
                    {
                        name: "Wizard",
                        value: `${round(account.timePlayed.wizard * 100, 2)}%`,
                        inline: true
                    },
                    {
                        name: "\u200B",
                        value: "\u200B",
                        inline: true
                    },
                    {
                        name: "Monk",
                        value: `${round(account.timePlayed.monk * 100, 2)}%`,
                        inline: true
                    },
                    {
                        name: "Crusader",
                        value: `${round(account.timePlayed.crusader * 100, 2)}%`,
                        inline: true
                    }
                ]
            },
            {
                title: "Story Progression",
                color: classColorMap[lastPlayed.class],
                fields: [
                    {
                        name: "Act 1",
                        value: account.progression.act1 ? "Completed" : "Incompleted",
                        inline: true
                    },
                    {
                        name: "\u200B",
                        value: "\u200B",
                        inline: true
                    },
                    {
                        name: "Act 2",
                        value: account.progression.act2 ? "Completed" : "Incompleted",
                        inline: true
                    },
                    {
                        name: "Act 3",
                        value: account.progression.act3 ? "Completed" : "Incompleted",
                        inline: true
                    },
                    {
                        name: "\u200B",
                        value: "\u200B",
                        inline: true
                    },
                    {
                        name: "Act 4",
                        value: account.progression.act4 ? "Completed" : "Incompleted",
                        inline: true
                    },
                    {
                        name: "Act 5",
                        value: account.progression.act5 ? "Completed" : "Incompleted",
                        inline: true
                    }
                ]
            },
            {
                author: {
                    name: "Last Played Character",
                    // prettier-ignore
                    icon_url: lastPlayed.seasonal && lastPlayed.hardcore
                        ? "https://files.catbox.moe/wznz0k.png"
                        : lastPlayed.seasonal
                            ? "https://files.catbox.moe/9yi5yd.png"
                            : lastPlayed.hardcore
                                ? "https://files.catbox.moe/6jydwb.png"
                                : undefined
                },
                thumbnail: {
                    url: classImageMap[`${lastPlayed.class}-${lastPlayed.gender === 0 ? "male" : "female"}`]
                },
                color: classColorMap[lastPlayed.class],
                description: `**__${lastPlayed.name}__**`,
                fields: [
                    {
                        name: "Level",
                        value: lastPlayed.level.toString(),
                        inline: true
                    },
                    {
                        name: "\u200B",
                        value: "\u200B",
                        inline: true
                    },
                    {
                        name: "Paragon",
                        value: lastPlayed.paragonLevel.toString(),
                        inline: true
                    },
                    {
                        name: "Season",
                        value: lastPlayed.seasonCreated.toString(),
                        inline: true
                    },
                    {
                        name: "\u200B",
                        value: "\u200B",
                        inline: true
                    },
                    {
                        name: "Highest Solo Rift",
                        value: lastPlayed.highestSoloRiftCompleted.toString(),
                        inline: true
                    },
                    {
                        name: "Alive",
                        value: lastPlayed.alive ? "yes" : "no"
                    },
                    {
                        name: "\u200B",
                        value: "**__Active Skills__**"
                    },
                    ...lastPlayed.skills.active.map((active) => ({ name: active.skill.name, value: active.rune?.name || "\u200B", inline: true })),
                    {
                        name: "\u200B",
                        value: `**__Passive Skills__**\n${lastPlayed.skills.passive.map((active) => active.skill.name).join("\n")}`
                    }
                ]
            }
        ];

        await EmbedPaginator.createPaginationEmbed(msg, embeds, {
            cycling: true,
            timeout: 5 * 60 * 1000,
            extendedButtons: true
        });
    }
}
