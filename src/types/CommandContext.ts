import Lilith from "~/utils/Client";

export interface CommandContext {
    client: Lilith;
    category: string;
}

export default CommandContext;
