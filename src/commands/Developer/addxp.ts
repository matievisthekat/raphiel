import { Command, Arg, Bot, CommandRunOptions, CommandResult } from "../../../lib";
import { Message, GuildMember } from "discord.js";
import Level from "../../models/Level";

export default class extends Command {
  constructor(client: Bot) {
    super(client, {
      name: "addxp",
      description: "Add xp to a member",
      category: "General",
      examples: ["@Example#0001 20"],
      args: [new Arg("member", "The member to add xp to", true), new Arg("amount", "The amount of xp to add", true)],
      devOnly: false,
      userPerms: ["MANAGE_GUILD"],
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
    const target = (await msg.client.getUserOrMember(args[0], msg.guild)) as GuildMember;
    if (!target) return msg.send("warn", "No target member was found");
    const amt = parseInt(args[1]);
    if (!amt || amt <= 0) return msg.send("warn", "Please supply a valid, positive number");

    const data =
      (await Level.findOne({ uid: target.user.id })) ||
      new Level({
        uid: target.user.id,
      });

    data.xp += amt;
    data.level = Math.floor(data.xp / 100);
    await data.save();

    await msg.send("success", `Added **${amt}** xp to ${target.user.tag}`);
    return { done: true };
  }
}
