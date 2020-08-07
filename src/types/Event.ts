import Lilith from "~/structures/Client";
import Settings from "./Settings";

interface Event {
    name: string;
    run: (client: Lilith, settings: Settings, ...args: any[]) => Promise<void>;
}

export default Event;
