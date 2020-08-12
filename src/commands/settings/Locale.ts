import Command from "~/Command";
import CommandContext from "~/types/CommandContext";
import Users from "~/models/User";
import settings from "~/settings";
import { Message } from "eris";
import { isGuildChannel, localeMap } from "~/utils/Utils";

export default class extends Command {
    constructor(ctx: CommandContext) {
        super({
            name: "locale",
            description: "Update the locale you set\n(locales are only used for the data returned by blizzard's api and not for the bot)",
            usage: "locale [locale]",
            example: "locale en_US",
            category: ctx.category
        });
    }

    async run(msg: Message, args: string[]): Promise<void> {
        let prefix = settings.prefix;
        if (isGuildChannel(msg.channel)) {
            prefix = msg.channel.guild.prefix;
        }

        const user = await Users.findOne({ uid: msg.author.id }).exec();
        if (!user) {
            await msg.channel.createMessage(`Please use \`${prefix}setup\` before using this command`);
            return;
        }

        if (args.length >= 1) {
            const locales = localeMap[user.region];
            const locale = args[0].trim();
            if (!locales.includes(locale)) {
                // prettier-ignore
                await msg.channel.createMessage(`Invalid locale, your region is \`${user.region}\` all the available locales in this region are ${locales.map((l) => `\`${l}\``).join(", ")}`);
                return;
            }

            await user.updateOne({ locale }).exec();
            await msg.channel.createMessage("Updated locale");
        } else {
            await msg.channel.createMessage(`Your current locale is \`${user.locale}\``);
        }
    }
}
