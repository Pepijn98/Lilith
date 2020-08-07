import Command from "~/Command";
import Lilith from "~/structures/Client";
import { Message } from "eris";
import { classImageMap, classColorMap } from "~/utils/Helpers";

export default class extends Command {
    constructor(category: string) {
        super({
            name: "hero",
            description: "Get more detailed info about a hero",
            usage: "hero <id>",
            example: "hero 123456789",
            requiredArgs: 1,
            botPermissions: ["embedLinks"],
            category
        });
    }

    async run(msg: Message, args: string[], client: Lilith): Promise<void> {
        const hero = await client.diablo.getHero(msg.author, args[0]);
        await msg.channel.createMessage({
            embed: {
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
                    url: classImageMap[`${hero.class}-${hero.gender === 0 ? "male" : "female"}`]
                },
                color: classColorMap[hero.class],
                fields: [
                    {
                        name: "Level",
                        value: hero.level.toString(),
                        inline: true
                    },
                    {
                        name: "Paragon",
                        value: hero.paragonLevel.toString(),
                        inline: true
                    },
                    {
                        name: "\u200B",
                        value: "\u200B",
                        inline: true
                    },
                    {
                        name: "Season",
                        value: hero.seasonCreated.toString(),
                        inline: true
                    },
                    {
                        name: "Highest Solo Rift",
                        value: hero.highestSoloRiftCompleted.toString(),
                        inline: true
                    },
                    {
                        name: "Alive",
                        value: hero.alive ? "yes" : "no"
                    },
                    {
                        name: "\u200B",
                        value: "**__Active Skills__**"
                    },
                    ...hero.skills.active.map((active) => ({ name: active.skill.name, value: active.rune.name, inline: true })),
                    {
                        name: "\u200B",
                        value: `**__Passive Skills__**\n${hero.skills.passive.map((active) => active.skill.name).join("\n")}`
                    }
                ]
            }
        });
    }
}
