import { Command, Arg, Bot, Util, CommandRunOptions, CommandResult } from "../../../lib";
import { Message } from "discord.js";

export default class extends Command {
  constructor(client: Bot) {
    super(client, {
      name: "exec",
      aliases: ["execute"],
      category: "Developer",
      description: "Execute a terminal command",
      examples: ["node -v"],
      args: [new Arg("command", "The command(s) to execute", true)],
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
  public async run(msg: Message, { args }: CommandRunOptions): Promise<CommandResult | Message> {
    const options = {
      split: {
        char: "\n",
        prepend: "```\n",
        append: "```",
      },
    };

    const res = await Util.execute(args.join(" "));

    for (const output of Object.entries(res)) {
      if (output[1]) await msg.channel.send(`**${output[0].title()}**\n\`\`\`\n${output[1]}\`\`\``, options);
    }

    await msg.send("success", "Command successfully run");

    return { done: true };
  }
}
