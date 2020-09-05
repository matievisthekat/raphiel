import { Command, Bot, CommandResult } from "../../../lib";
import { Message } from "discord.js";
import User from "../../models/User";

export default class extends Command {
  constructor(client: Bot) {
    super(client, {
      name: "setbackground",
      aliases: ["setbg"],
      description: "Set your profile background",
      category: "Profile",
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
  public async run(msg: Message): Promise<CommandResult | Message> {
    const attachment = msg.attachments.first();
    if (!attachment) return msg.send("warn", "Please supply an image");

    const formats = ["png", "jpg", "jpeg", "webp"];
    if (!formats.includes(attachment.url.split(".").pop()))
      return msg.send("warn", `Please supply a valid image (${formats.join(", ")})`);

    const data = (await User.findOne({ id: msg.author.id })) || new User({ id: msg.author.id });
    data.bgUrl = attachment.url;
    await data.save();

    await msg.send("success", "Set your background image");
    return { done: true };
  }
}
