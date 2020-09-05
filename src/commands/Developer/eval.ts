import { Command, Arg, Bot, CommandRunOptions, CommandResult } from "../../../lib";
import { inspect } from "util";
import { Message } from "discord.js";

export default class extends Command {
  constructor(client: Bot) {
    super(client, {
      name: "eval",
      aliases: ["evaluate", "ev"],
      category: "Developer",
      description: "Evaluate some code",
      // eslint-disable-next-line quotes
      examples: ['msg.client.emit("ready");'],
      args: [new Arg("code", "The code to evaluate", true)],
      devOnly: true,
      __filename,
    });
  }
  /**
   * @param {Message} msg The message that fired this command
   * @param {object} commandArgs The arguments run with every command
   * @param {Command} commandArgs.command The command that was run
   * @param {Array<string>} commandArgs.args The arguments run with the command
   * @param {object} commandArgs.flags The flags run for the command
   * @returns {Promise<CommandResult | Message>} The success status object
   * @public
   */
  public async run(msg: Message, { args, flags }: CommandRunOptions): Promise<CommandResult | Message> {
    const options = {
      split: {
        char: "\n",
        prepend: "```js\n",
        append: "```",
      },
    };

    const match = args[0].match(/:(depth)=(\w+)/gm);
    const depth = match ? match[0]?.split("=")[1] : null;

    let code = args.slice(match ? 1 : 0).join(" ");
    if (code.includes("await")) code = `(async () => {${code}})();`;

    const result = new Promise((resolve) => resolve(eval(code)));
    result
      .then(async (output) => {
        output = inspect(output, false, depth ? parseInt(depth) : 1);

        if (!flags.silent) await msg.channel.send("```js\n" + output + "```", options);
      })
      .catch(async (err) => {
        await msg.channel.send("```js\n" + err + "```", options);
      });

    return { done: true };
  }
}
