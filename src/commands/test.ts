import { SlashCommand, SlashCreator, CommandContext, ComponentType, Message, MessageOptions, ComponentSelectMenu, ComponentSelectOption } from "slash-create";

export default class RegionCommand extends SlashCommand {
    constructor(creator: SlashCreator) {
        super(creator, {
            name: "test",
            description: "Just a test"
        });
    }

    async run(ctx: CommandContext): Promise<void> {
        await ctx.defer();

        const regions: ComponentSelectOption[] = [
            {
                emoji: {
                    name: "🇺🇸"
                },
                label: "United States",
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

        const options: MessageOptions = {
            components: [
                {
                    type: ComponentType.ACTION_ROW,
                    components: [
                        {
                            type: ComponentType.SELECT,
                            custom_id: "region",
                            options: regions,
                            min_values: 1,
                            max_values: 1
                        }
                    ]
                }
            ]
        };

        const msg = await ctx.send("Select your new region:", options);

        return ctx.registerComponent("region", async (mctx) => {
            await mctx.acknowledge();

            if (msg instanceof Message && ctx.member && mctx.member && ctx.member.id === mctx.member.id) {
                const menu = options.components[0].components[0] as ComponentSelectMenu;
                const region = regions.find((v) => v.value === mctx.values[0]);
                menu.placeholder = `Region set to ${region.label}`;
                menu.disabled = true;
                msg.edit(options);
                mctx.unregisterComponent("region", msg.id);
            }
        });
    }
}
