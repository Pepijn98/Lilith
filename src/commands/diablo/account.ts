import Account from "../../types/diablo/Account";
import Embed from "../../utils/Embed";
import Hero from "../../types/diablo/Hero";
import Lilith from "../../utils/Lilith";

import {
    ButtonStyle,
    CommandContext,
    CommandOptionType,
    ComponentActionRow,
    ComponentButton,
    ComponentType,
    MessageEmbedOptions,
    SlashCommand,
    SlashCreator
} from "slash-create";
import { classColors, classImages, rbattleTag, regionChoices, round } from "../../utils/Helpers";

function updateButtonState(button: ComponentButton, page: number, lastPage: number): void {
    if (button.custom_id === "previous" || button.custom_id === "first") {
        if (page === 0) {
            button.disabled = true;
        } else {
            button.disabled = false;
        }
    }

    if (button.custom_id === "next" || button.custom_id === "last") {
        if (page === lastPage) {
            button.disabled = true;
        } else {
            button.disabled = false;
        }
    }
}

export default class AccountCommand extends SlashCommand<Lilith> {
    constructor(creator: SlashCreator) {
        super(creator, {
            name: "account",
            description: "Get details about your d3 account",
            requiredPermissions: [
                "SEND_MESSAGES"
            ],
            options: [
                {
                    type: CommandOptionType.STRING,
                    name: "region",
                    description: "The region of your account",
                    choices: regionChoices
                },
                {
                    type: CommandOptionType.STRING,
                    name: "battletag",
                    description: "Your BattleTag (abcxyz#12345)"
                }
            ]
        });
    }

    async run(ctx: CommandContext): Promise<void> {
        await ctx.defer();

        if ((!ctx.options.region && ctx.options.battletag) || (ctx.options.region && !ctx.options.battletag)) {
            await Embed.Danger(ctx, "❌ Region and BattleTag have to be used together.");
            return;
        }

        let page = 0;

        let account: Account;
        let lastPlayed: Hero;

        if (ctx.options.region && ctx.options.batlletag) {
            if (!rbattleTag.test(ctx.options.batlletag)) {
                await Embed.Danger(ctx, "❌ Invalid battle tag");
                return;
            }

            account = await this.client.diablo.getAccountByTag(ctx.options.region, ctx.options.batlletag);
            lastPlayed = await this.client.diablo.getHeroByTag(account.lastHeroPlayed.toString(), ctx.options.region, ctx.options.batlletag);
        } else {
            account = await this.client.diablo.getAccount(ctx.user.id);
            lastPlayed = await this.client.diablo.getHero(ctx.user.id, account.lastHeroPlayed.toString());
        }

        const embeds: MessageEmbedOptions[] = [
            {
                title: account.battleTag,
                color: classColors[lastPlayed.class],
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
                color: classColors[lastPlayed.class],
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
                color: classColors[lastPlayed.class],
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
                    url: classImages[`${lastPlayed.class}-${lastPlayed.gender === 0 ? "male" : "female"}`]
                },
                color: classColors[lastPlayed.class],
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

        const buttons: ComponentActionRow[] = [
            {
                type: ComponentType.ACTION_ROW,
                components: [
                    {
                        type: ComponentType.BUTTON,
                        custom_id: "first",
                        label: "First",
                        // emoji: {
                        //     name: "⏪"
                        // },
                        style: ButtonStyle.PRIMARY,
                        disabled: true
                    },
                    {
                        type: ComponentType.BUTTON,
                        custom_id: "previous",
                        label: "Previous",
                        // emoji: {
                        //     name: "◀️"
                        // },
                        style: ButtonStyle.PRIMARY,
                        disabled: true
                    },
                    {
                        type: ComponentType.BUTTON,
                        custom_id: "next",
                        label: "Next",
                        // emoji: {
                        //     name: "▶️"
                        // },
                        style: ButtonStyle.PRIMARY
                    },
                    {
                        type: ComponentType.BUTTON,
                        custom_id: "last",
                        label: "Last",
                        // emoji: {
                        //     name: "⏩"
                        // },
                        style: ButtonStyle.PRIMARY
                    },
                    {
                        type: ComponentType.BUTTON,
                        custom_id: "stop",
                        label: "Stop",
                        // emoji: {
                        //     name: "⏹️"
                        // },
                        style: ButtonStyle.DESTRUCTIVE
                    }
                ]
            }
        ];

        await ctx.send({
            embeds: [embeds[page]],
            components: buttons
        });

        ctx.registerComponent(
            "first",
            async (cctx) => {
                if (ctx.user.id !== cctx.user.id) {
                    return Embed.Warning(cctx, "⚠️ Button actions can only be performed by the user that invoked the command.", { ephemeral: true });
                }

                page = 0;

                for (const btn of buttons[0].components as ComponentButton[]) {
                    updateButtonState(btn, page, embeds.length - 1);
                }

                await cctx.editOriginal({
                    embeds: [embeds[page]],
                    components: buttons
                });
            },
            1000 * 60 * 5
        );

        ctx.registerComponent(
            "previous",
            async (cctx) => {
                if (ctx.user.id !== cctx.user.id) {
                    return Embed.Warning(cctx, "⚠️ Button actions can only be performed by the user that invoked the command.", { ephemeral: true });
                }

                page = page === 0 ? 0 : page - 1;

                for (const btn of buttons[0].components as ComponentButton[]) {
                    updateButtonState(btn, page, embeds.length - 1);
                }

                await cctx.editOriginal({
                    embeds: [embeds[page]],
                    components: buttons
                });
            },
            1000 * 60 * 5
        );

        ctx.registerComponent(
            "next",
            async (cctx) => {
                if (ctx.user.id !== cctx.user.id) {
                    return Embed.Warning(cctx, "⚠️ Button actions can only be performed by the user that invoked the command.", { ephemeral: true });
                }

                page = page === embeds.length - 1 ? page : page + 1;

                for (const btn of buttons[0].components as ComponentButton[]) {
                    updateButtonState(btn, page, embeds.length - 1);
                }

                await cctx.editOriginal({
                    embeds: [embeds[page]],
                    components: buttons
                });
            },
            1000 * 60 * 5
        );

        ctx.registerComponent(
            "last",
            async (cctx) => {
                if (ctx.user.id !== cctx.user.id) {
                    return Embed.Warning(cctx, "⚠️ Button actions can only be performed by the user that invoked the command.", { ephemeral: true });
                }

                page = embeds.length - 1;

                for (const btn of buttons[0].components as ComponentButton[]) {
                    updateButtonState(btn, page, embeds.length - 1);
                }

                await cctx.editOriginal({
                    embeds: [embeds[page]],
                    components: buttons
                });
            },
            1000 * 60 * 5
        );

        ctx.registerComponent(
            "stop",
            async (cctx) => {
                if (ctx.user.id !== cctx.user.id) {
                    return Embed.Warning(cctx, "⚠️ Button actions can only be performed by the user that invoked the command.", { ephemeral: true });
                }

                for (const btn of buttons[0].components as ComponentButton[]) {
                    btn.disabled = true;
                }

                await cctx.editOriginal({ components: buttons });

                ctx.unregisterComponent("first");
                ctx.unregisterComponent("previous");
                ctx.unregisterComponent("next");
                ctx.unregisterComponent("last");
                ctx.unregisterComponent("stop");
            },
            1000 * 60 * 5,
            async () => {
                for (const btn of buttons[0].components as ComponentButton[]) {
                    btn.disabled = true;
                }

                await ctx.editOriginal({ components: buttons });
            }
        );
    }
}
