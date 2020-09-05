import { Command, Arg, Bot, CommandRunOptions, CommandResult } from "../../../lib";
import { Message } from "discord.js";

export default class extends Command {
  constructor(client: Bot) {
    super(client, {
      name: "embed",
      description: "Embed a message",
      category: "General",
      examples: ["hello this is an announcement"],
      args: [new Arg("message", "THe message to embed", true)],
      devOnly: false,
      botPerms: ["MANAGE_MESSAGES", "EMBED_LINKS"],
      userPerms: ["EMBED_LINKS"],
      cooldown: "3s",
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
    await msg.send("success", new msg.client.Embed().setDescription(args.join(" ")));
    if (msg.deletable) await msg.delete().catch(() => {});
    return { done: true };
  }
}
