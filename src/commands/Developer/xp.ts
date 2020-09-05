import { Command, Arg, Bot, CommandRunOptions, CommandResult } from "../../../lib";
import { Message, GuildMember } from "discord.js";
import Level from "../../models/Level";

export default class extends Command {
  constructor(client: Bot) {
    super(client, {
      name: "xp",
      description: "Check the xp of a member",
      category: "General",
      examples: ["@Example#0001"],
      args: [new Arg("member", "The member to add xp to", false)],
      devOnly: false,
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
    const target = (await msg.client.getUserOrMember(
      args.join(" ") || msg.author.toString(),
      msg.guild
    )) as GuildMember;
    if (!target) return msg.send("warn", "No target member was found");

    const data = await Level.findOne({ uid: target.user.id });
    if (!data) return msg.send("warn", "That member has no xp");

    await msg.send("success", `${target.user.tag} has **${data.xp}** xp and is on level **${data.level}**`);
    return { done: true };
  }
}
