import Lilith from "~/structures/Client";

interface Event {
    name: string;
    run: (client: Lilith, ...args: any[]) => Promise<unknown>;
}

export default Event;
