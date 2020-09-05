import { Bot, Util, CommandOptions } from "../../";
import { Collection, Message } from "discord.js";
import { EventEmitter } from "events";
import { CommandResult, CommandRunOptions } from "../../types";

export class Arg {
  public name: string;

  constructor(name: string, public desc: string, public required?: boolean) {
    this.name = name.replace(/ +/gi, "_");
  }
}

export class Command extends EventEmitter {
  public cooldown: Collection<string, number> = new Collection();

  constructor(public client: Bot, public readonly opts: CommandOptions) {
    super();

    this.opts.usage = this.opts.args?.map((a) => `${Util.formatArg(a)}`).join(" ");
    if (!this.opts.cooldown) this.opts.cooldown = "3s";
  }

  /**
   * @param {Message} msg The message that triggered this command
   * @param {Command} command The command that was triggered
   * @param {Array<String>} args The arguments this command was run with
   * @param {Object} flags The flags this command was run with
   * @returns A promise
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async run(msg: Message, { command, args, flags }: CommandRunOptions): Promise<CommandResult | Message> {
    msg.client.logger.warn(`Command without a run method at ${this.opts.__filename}`);
    return { done: false };
  }

  /**
   * @returns The success status of unloading the command
   * @public
   */
  unload(): boolean {
    if (!this.opts.__filename) return false;
    const res = this.client.cmd.unloadCommand(this.opts.__filename);
    return res;
  }

  /**
   * @returns The reloaded command or the sucess status of reloading the command
   * @public
   */
  reload(): boolean | Command {
    if (!this.opts.__filename) return false;

    const unloadRes = this.unload();
    if (!unloadRes) return unloadRes;

    const res = this.client.cmd.loadCommand(this.opts.__filename);
    return res;
  }
}
