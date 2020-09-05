import { Command, Arg, Bot, CommandRunOptions, CommandResult } from "../../../lib";
import { Message } from "discord.js";
import { GuildMember } from "discord.js";

export default class extends Command {
  constructor(client: Bot) {
    super(client, {
      name: "avatar",
      aliases: ["av"],
      description: "View someone's avatar",
      category: "General",
      examples: ["@Example#0001", ""],
      args: [new Arg("user", "The user to view the avatar for")],
      devOnly: false,
      botPerms: ["EMBED_LINKS"],
      userPerms: [],
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
    const target = await msg.client.getUserOrMember(args.join(" ") || msg.author.toString(), msg.guild);
    if (!target) return msg.send("warn", "No user found");
    const av = (target instanceof GuildMember ? target.user : target).displayAvatarURL({ format: "png" });
    await msg.send(
      "success",
      new msg.client.Embed()
        .setImage(av)
        .setTitle(`${(target instanceof GuildMember ? target.user : target).tag}'s avatar`)
        .setURL(av)
    );
    return { done: true };
  }
}
