import Command from "~/Command";
import CommandContext from "~/types/CommandContext";
import Users from "~/models/User";
import { Message } from "eris";
import { sleep, rbattleTag, localeMap } from "~/utils/Utils";

const options = {
    time: 10000,
    maxMatches: 1
};

export default class extends Command {
    constructor(ctx: CommandContext) {
        super({
            name: "setup",
            description: "Get started using Lilith by setting up your battle tag, region and locale",
            usage: "setup",
            example: "setup",
            guildOnly: true,
            category: ctx.category
        });
    }

    async run(msg: Message): Promise<void> {
        const user = await Users.findOne({ uid: msg.author.id }).exec();
        if (!user) {
            await Users.create({ uid: msg.author.id, region: "", locale: "", battleTag: "" });
        } else {
            msg.channel.createMessage("You've already setup your account, to update it use the dedicated commands.\n`;tag`, `;region`, `;locale`");
            return;
        }

        // Set battle tag
        await msg.channel.createMessage(`[1/3] ${msg.member?.mention || msg.author.tag}, Please tell me your battle tag using this format \`Name#1234\``);
        const battleTag = await msg.channel.awaitMessages((m) => m.author.id === msg.author.id, options);
        if (battleTag.length >= 1) {
            const isValidTag = rbattleTag.test(battleTag[0].content.trim());
            if (isValidTag) {
                await Users.findOneAndUpdate({ uid: msg.author.id }, { battleTag: battleTag[0].content.trim() }).exec();
                await msg.channel.createMessage("Battle tag successfully updated!");
            } else {
                await Users.deleteOne({ uid: msg.author.id });
                await msg.channel.createMessage("Invalid battle tag, please use this format `Name#1234`");
                return;
            }
        } else {
            await Users.deleteOne({ uid: msg.author.id });
            await msg.channel.createMessage("You took too long to answer, please try again and answer within 10 seconds.");
            return;
        }

        // Avoid spamming the channel
        await sleep(500);

        // Set region
        await msg.channel.createMessage(
            `[2/3] ${msg.member?.mention || msg.author.tag}, What region do you want to use?\nThis can be one of \`us\`, \`eu\`, \`kr\`, \`tw\`, \`cn\``
        );
        const region = await msg.channel.awaitMessages((m) => m.author.id === msg.author.id, options);
        if (region.length >= 1) {
            if (["us", "eu", "kr", "tw", "cn"].includes(region[0].content.trim())) {
                await Users.findOneAndUpdate({ uid: msg.author.id }, { region: region[0].content.trim() }).exec();
                await msg.channel.createMessage("Region successfully updated!");
            } else {
                await Users.deleteOne({ uid: msg.author.id });
                await msg.channel.createMessage("Invalid region, region has be one of `us`, `eu`, `kr`, `tw`, `cn`");
                return;
            }
        } else {
            await Users.deleteOne({ uid: msg.author.id });
            await msg.channel.createMessage("You took too long to answer, please try again and answer within 10 seconds.");
            return;
        }

        // Avoid spamming the channel
        await sleep(500);

        // Set locale
        const locales = localeMap[region[0].content.trim()];
        // prettier-ignore
        await msg.channel.createMessage(`[3/3] ${msg.member?.mention || msg.author.tag}, Which locale do you like to use?\nSince you chose \`${region[0].content.trim()}\` as region these are the locales available to you ${locales.map((l) => `\`${l}\``).join(", ")}`);
        const locale = await msg.channel.awaitMessages((m) => m.author.id === msg.author.id, options);
        if (locale.length >= 1) {
            if (locales.includes(locale[0].content.trim())) {
                await Users.findOneAndUpdate({ uid: msg.author.id }, { locale: locale[0].content.trim() }).exec();
                await msg.channel.createMessage("Locale successfully updated!");
            } else {
                await Users.deleteOne({ uid: msg.author.id });
                // prettier-ignore
                await msg.channel.createMessage(`Invalid locale, the region you have chosen does not have this locale.\nLocales available to you are ${locales.map((l) => `\`${l}\``).join(", ")}\nFor more information visit https://github.com/Pepijn98/Lilith#regions-and-their-corresponding-locales`);
                return;
            }
        } else {
            await Users.deleteOne({ uid: msg.author.id });
            await msg.channel.createMessage("You took too long to answer, please try again and answer within 10 seconds.");
            return;
        }

        await msg.channel.createMessage("Successfully setup account");
    }
}
