import Lilith from "~/utils/Lilith";

interface Event {
    name: string;
    run: (client: Lilith, ...args: any[]) => Promise<unknown>;
}

export default Event;
