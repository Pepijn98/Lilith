import Event from "~/types/Event";
import Lilith from "~/structures/Client";

export default class implements Event {
    name = "disconnect";
    async run(client: Lilith): Promise<void> {
        client.logger.warn("DISCONNECT", "Client disconnected\n");
    }
}
