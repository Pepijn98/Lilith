import Embed from "../../utils/Embed";
import Lilith from "../../utils/Lilith";

import { Account, Hero } from "../../types/diablo/Account";
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
import { classChoices, classColors, classImages, rbattleTag, regionChoices } from "../../utils/Helpers";

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

export default class HeroesCommand extends SlashCommand<Lilith> {
    constructor(creator: SlashCreator) {
        super(creator, {
            name: "heroes",
            description: "Get a list of heroes",
            requiredPermissions: [
                "SEND_MESSAGES"
            ],
            options: [
                {
                    type: CommandOptionType.STRING,
                    name: "class",
                    description: "List of heroes from a specific class",
                    choices: classChoices
                },
                {
                    type: CommandOptionType.STRING,
                    name: "battletag",
                    description: "Your BattleTag (AbcXyz#12345)"
                },
                {
                    type: CommandOptionType.STRING,
                    name: "region",
                    description: "The region of the account",
                    choices: regionChoices
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

        const embeds: MessageEmbedOptions[] = [];
        let account: Account;
        let heroes: Hero[];

        if (ctx.options.region && ctx.options.batlletag) {
            if (!rbattleTag.test(ctx.options.batlletag)) {
                await Embed.Danger(ctx, "❌ Invalid battle tag");
                return;
            }

            account = await this.client.diablo.getAccountByTag(ctx.options.region, ctx.options.batlletag);
        } else {
            account = await this.client.diablo.getAccount(ctx.user.id);
        }

        if (ctx.options.class) {
            heroes = account.heroes.filter((hero) => hero.classSlug === ctx.options.class);
        } else {
            heroes = account.heroes;
        }

        for (const hero of heroes) {
            embeds.push({
                author: {
                    name: hero.name,
                    // prettier-ignore
                    icon_url: hero.seasonal && hero.hardcore
                        ? "https://files.catbox.moe/wznz0k.png"
                        : hero.seasonal
                            ? "https://files.catbox.moe/9yi5yd.png"
                            : hero.hardcore
                                ? "https://files.catbox.moe/6jydwb.png"
                                : undefined
                },
                thumbnail: {
                    url: classImages[`${hero.classSlug}-${hero.gender === 0 ? "male" : "female"}`]
                },
                description:
                    `ID: ${hero.id}\n` +
                    `Class: ${hero.class
                        .split("-")
                        .map((part) => part.capitalize())
                        .join(" ")}\n` +
                    "\n\n" +
                    "`/hero <id>` for more details",
                color: classColors[hero.classSlug]
            });
        }

        if (!embeds.length) {
            await Embed.Warning(ctx, "⚠️ No heroes found");
            return;
        }

        if (embeds.length === 1) {
            await ctx.send({ embeds });
            return;
        }

        let page = 0;

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
