import Users from "../../models/User";
import Lilith from "../../utils/Lilith";
import { Embed } from "../../utils/Embed";
import { getDBUser, rbattleTag } from "../../utils/Helpers";
import { CommandContext, ComponentSelectOption, ComponentType, SlashCommand, SlashCreator, TextInputStyle } from "slash-create";

const regions: ComponentSelectOption[] = [
    {
        emoji: {
            name: "🇺🇸"
        },
        label: "North America",
        value: "us"
    },
    {
        emoji: {
            name: "🇪🇺"
        },
        label: "Europe",
        value: "eu"
    },
    {
        emoji: {
            name: "🇰🇷"
        },
        label: "Korea",
        value: "kr"
    },
    {
        emoji: {
            name: "🇹🇼"
        },
        label: "Taiwan",
        value: "tw"
    },
    {
        emoji: {
            name: "🇨🇳"
        },
        label: "China",
        value: "cn"
    }
];

const locales: Record<string, ComponentSelectOption[]> = {
    us: [
        {
            emoji: {
                name: "🇺🇸"
            },
            label: "English (United States)",
            value: "en_US"
        },
        {
            emoji: {
                name: "🇲🇽"
            },
            label: "Spanish (Mexico)",
            value: "es_MX"
        },
        {
            emoji: {
                name: "🇧🇷"
            },
            label: "Portuguese (Brazil)",
            value: "pt_BR"
        }
    ],
    eu: [
        {
            emoji: {
                name: "🇬🇧"
            },
            label: "English (United Kingdom)",
            value: "en_GB"
        },
        {
            emoji: {
                name: "🇪🇸"
            },
            label: "Spanish",
            value: "es_ES"
        },
        {
            emoji: {
                name: "🇫🇷"
            },
            label: "French",
            value: "fr_FR"
        },
        {
            emoji: {
                name: "🇷🇺"
            },
            label: "Russian",
            value: "ru_RU"
        },
        {
            emoji: {
                name: "🇩🇪"
            },
            label: "German",
            value: "de_DE"
        },
        {
            emoji: {
                name: "🇵🇹"
            },
            label: "Portuguese",
            value: "pt_PT"
        },
        {
            emoji: {
                name: "🇮🇹"
            },
            label: "Italian",
            value: "it_IT"
        }
    ],
    kr: [
        {
            emoji: {
                name: "🇰🇷"
            },
            label: "Korean (South Korea)",
            value: "ko_KR"
        }
    ],
    tw: [
        {
            emoji: {
                name: "🇹🇼"
            },
            label: "Chinese (Taiwan)",
            value: "zh_TW"
        }
    ],
    cn: [
        {
            emoji: {
                name: "🇨🇳"
            },
            label: "Chinese",
            value: "zh_CN"
        }
    ]
};

export default class SetupCommand extends SlashCommand<Lilith> {
    constructor(creator: SlashCreator) {
        super(creator, {
            name: "setup",
            description: "Setup your battle.net info"
        });
    }

    async run(ctx: CommandContext): Promise<unknown> {
        await ctx.defer(true);

        const user = await getDBUser(ctx.user.id);
        if (user) {
            return Embed.Warning(ctx, "⚠️ Account already setup, use `/locale`, `/region` or `/tag` to modify your info.", { ephemeral: true });
        }

        let region = "";
        let locale = "";

        await ctx.send("Select your region:", {
            ephemeral: true,
            components: [
                {
                    type: ComponentType.ACTION_ROW,
                    components: [
                        {
                            type: ComponentType.SELECT,
                            custom_id: "region",
                            options: regions,
                            min_values: 1,
                            max_values: 1,
                            placeholder: "Select a region"
                        }
                    ]
                }
            ]
        });

        ctx.registerComponent(
            "region",
            async (regionCtx) => {
                if (ctx.user.id !== regionCtx.user.id) {
                    return Embed.Warning(ctx, "⚠️ This command was triggered by someone else, if you want to setup your account use `/setup` yourself.", {
                        ephemeral: true
                    });
                }

                if (regionCtx.values[0]) {
                    region = regionCtx.values[0];

                    regionCtx.editOriginal("Select your locale:", {
                        components: [
                            {
                                type: ComponentType.ACTION_ROW,
                                components: [
                                    {
                                        type: ComponentType.SELECT,
                                        custom_id: "locale",
                                        options: locales[region],
                                        min_values: 1,
                                        max_values: 1,
                                        placeholder: "Select a locale"
                                    }
                                ]
                            }
                        ]
                    });

                    ctx.unregisterComponent("region");
                }
            },
            1000 * 60
        );

        ctx.registerComponent(
            "locale",
            async (localeCtx) => {
                if (ctx.user.id !== localeCtx.user.id) {
                    return Embed.Warning(ctx, "⚠️ This command was triggered by someone else, if you want to setup your account use `/setup` yourself.", {
                        ephemeral: true
                    });
                }

                if (localeCtx.values[0]) {
                    locale = localeCtx.values[0];

                    await localeCtx.sendModal(
                        {
                            title: "Enter your Blizzard BattleTag:",
                            components: [
                                {
                                    type: ComponentType.ACTION_ROW,
                                    components: [
                                        {
                                            type: ComponentType.TEXT_INPUT,
                                            custom_id: "battletag",
                                            label: "BattleTag",
                                            style: TextInputStyle.SHORT,
                                            min_length: 8,
                                            required: true,
                                            placeholder: "AbcXyz#12345"
                                        }
                                    ]
                                }
                            ]
                        },
                        async (mctx) => {
                            if (!rbattleTag.test(mctx.values.battletag)) {
                                localeCtx.editOriginal("❌ Invalid BattleTag (example: AbcXyz#12345).", { components: [] });
                                ctx.unregisterComponent("locale");
                                return;
                            }

                            try {
                                await mctx.acknowledge();
                                await Users.create({ uid: ctx.user.id, region, locale, battleTag: mctx.values.battletag });
                                await localeCtx.editOriginal("✅ Account created.", { components: [] });
                            } catch (e) {
                                this.client.logger.error("CMD:SETUP", e);
                                Embed.Danger(ctx, "❌ Failed creating account.", { ephemeral: true });
                            }
                        }
                    );

                    ctx.unregisterComponent("locale");
                }
            },
            1000 * 60,
            async () => {
                await Embed.Info(ctx, "ℹ️ You took too long to answer, command has expired.", { ephemeral: true });
                await ctx.delete();
            }
        );
    }
}
