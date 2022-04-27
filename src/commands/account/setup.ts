import Users from "../../models/User";
import { getDBUser, rbattleTag } from "../../utils/Helpers";
import { SlashCommand, SlashCreator, CommandContext, ComponentSelectOption, ComponentType, CommandOptionType } from "slash-create";

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

export default class SetupCommand extends SlashCommand {
    constructor(creator: SlashCreator) {
        super(creator, {
            name: "setup",
            description: "Setup your battle.net info",
            options: [
                {
                    type: CommandOptionType.STRING,
                    name: "battletag",
                    description: "Your BattleTag (abcxyz#12345)",
                    required: true
                }
            ]
        });
    }

    async run(ctx: CommandContext): Promise<any> {
        await ctx.defer();

        if (ctx.options.battletag) {
            if (!rbattleTag.test(ctx.options.battletag)) {
                return "❌ Invalid BattleTag (example: abcxyz#12345).";
            }

            let user = await getDBUser(ctx.user.id);
            if (!user) {
                user = await Users.create({ uid: ctx.user.id, region: "", locale: "", battleTag: ctx.options.battletag });
            } else {
                return "⚠️ Account already setup, use `/locale`, `/region` or `/tag` to modify your info.";
            }

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
                        return regionCtx.send("⚠️ This command was triggered by someone else, if you want to setup your account use `/setup` yourself.", {
                            ephemeral: true
                        });
                    }

                    if (regionCtx.values[0]) {
                        await user.updateOne({ region: regionCtx.values[0] }).exec();

                        regionCtx.editOriginal("Select your locale", {
                            components: [
                                {
                                    type: ComponentType.ACTION_ROW,
                                    components: [
                                        {
                                            type: ComponentType.SELECT,
                                            custom_id: "locale",
                                            options: locales[regionCtx.values[0]],
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
                15 * 1000,
                () => ctx.unregisterComponent("region")
            );

            ctx.registerComponent(
                "locale",
                async (localeCtx) => {
                    if (ctx.user.id !== localeCtx.user.id) {
                        return localeCtx.send("⚠️ This command was triggered by someone else, if you want to setup your account use `/setup` yourself.", {
                            ephemeral: true
                        });
                    }

                    if (localeCtx.values[0]) {
                        await user.updateOne({ locale: localeCtx.values[0] }).exec();
                        await localeCtx.editOriginal("✅ Account created.", { components: [] });
                        ctx.unregisterComponent("locale");
                    }
                },
                15 * 1000,
                async () => {
                    ctx.unregisterComponent("locale");
                    await user.delete();
                    await ctx.send("ℹ️ You took too long to answer, command has expired.", { ephemeral: true });
                    await ctx.delete();
                }
            );
        }
    }
}
