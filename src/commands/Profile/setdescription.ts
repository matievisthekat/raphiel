import { Command, Bot, CommandResult, CommandRunOptions, Arg } from "../../../lib";
import { Message } from "discord.js";
import User from "../../models/User";

export default class extends Command {
  constructor(client: Bot) {
    super(client, {
      name: "setdescription",
      aliases: ["setdesc"],
      description: "Set your profile description",
      category: "Profile",
      args: [new Arg("desc", "Your description", true)],
      devOnly: false,
      cooldown: "5s",
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
    const data = (await User.findOne({ id: msg.author.id })) || new User({ id: msg.author.id });
    data.desc = args.join(" ");
    await data.save();

    await msg.send("success", "Set your description");
    return { done: true };
  }
}
