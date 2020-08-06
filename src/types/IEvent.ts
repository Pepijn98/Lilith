import Lilith from "../structures/Client";
import { ISettings } from "./ISettings";

export interface IEvent {
    name: string;
    run: (client: Lilith, settings: ISettings, ...args: any[]) => Promise<void>;
}
