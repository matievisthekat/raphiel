import { EventEmitter } from "events";
import { Util, CustomEvent, Bot } from "../../";
import { Collection } from "discord.js";

export class EventManager extends EventEmitter {
  public events: Collection<string, CustomEvent> = new Collection();

  constructor(private client: Bot, private dir: string) {
    super();
  }

  /**
   * @retruns A collection of events
   * @public
   */
  public load(): Collection<string, CustomEvent> {
    const files = Util.findNested(this.dir);
    for (const file of files) this.loadEvent(file);

    this.emit("ready", this.events);
    return this.events;
  }

  /**
   * @param {String} path The file path of the event
   * @returns The success status of unloading the event
   * @public
   */
  public unloadEvent(path: string): boolean {
    const event = this.events.find((e) => e.opts.__filename === path);
    if (!event) return false;

    this.client.removeAllListeners(event.opts.name);
    delete require.cache[event.opts.__filename];
    this.events.delete(event.opts.name);

    return true;
  }

  /**
   * @param {String} path The file poth of the event
   * @returns The loaded command or the sucess status of loading the event
   * @public
   */
  public loadEvent(path: string): CustomEvent | boolean {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const required = require(path);

    const event = new required.default(this.client);
    if (!event.opts.name) return false;

    this.client.on(event.opts.name, event.run.bind(null, this.client));
    this.events.set(event.opts.name, event);

    return event;
  }
}
