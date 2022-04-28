import { AutocompleteChoice, AutocompleteContext, CommandContext, CommandOptionType, SlashCommand, SlashCreator } from "slash-create";
import { getDBUser } from "../../utils/Helpers";

const locales: Record<string, AutocompleteChoice[]> = {
    us: [
        {
            name: "English (United States)",
            value: "en_US"
        },
        {
            name: "Spanish (Mexico)",
            value: "es_MX"
        },
        {
            name: "Portuguese (Brazil)",
            value: "pt_BR"
        }
    ],
    eu: [
        {
            name: "English (United Kingdom)",
            value: "en_GB"
        },
        {
            name: "Spanish",
            value: "es_ES"
        },
        {
            name: "French",
            value: "fr_FR"
        },
        {
            name: "Russian",
            value: "ru_RU"
        },
        {
            name: "German",
            value: "de_DE"
        },
        {
            name: "Portuguese",
            value: "pt_PT"
        },
        {
            name: "Italian",
            value: "it_IT"
        }
    ],
    kr: [
        {
            name: "Korean (South Korea)",
            value: "ko_KR"
        }
    ],
    tw: [
        {
            name: "Chinese (Taiwan)",
            value: "zh_TW"
        }
    ],
    cn: [
        {
            name: "Chinese",
            value: "zh_CN"
        }
    ]
};

export default class LocaleCommand extends SlashCommand {
    constructor(creator: SlashCreator) {
        super(creator, {
            name: "locale",
            description: "Set locale for api response data from blizzard (does NOT change locale for the bot)",
            options: [
                {
                    type: CommandOptionType.STRING,
                    name: "locale",
                    description: "Allowed locale(s) for your region",
                    autocomplete: true
                }
            ]
        });
    }

    async autocomplete(ctx: AutocompleteContext): Promise<void> {
        const user = await getDBUser(ctx.user.id);
        if (!user) {
            const userLocales = Object.values(locales).flat();
            await ctx.sendResults(userLocales);
            return;
        }

        await ctx.sendResults(locales[user.region]);
    }

    async run(ctx: CommandContext): Promise<string> {
        await ctx.defer();

        const user = await getDBUser(ctx.user.id);
        if (!user) {
            return "⚠️ Please use the `/setup` command before using any of the other Diablo related commands.";
        }

        if (ctx.options.locale) {
            try {
                await user.updateOne({ locale: ctx.options.locale }).exec();
                return "✅ Success updating locale.";
            } catch (e) {
                return "❌ Failed updating locale.";
            }
        } else {
            return `ℹ️ Your current locale is: \`${user.locale}\`.`;
        }
    }
}
