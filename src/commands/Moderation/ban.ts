import { Command, Arg, Bot, CommandRunOptions, CommandResult, Util } from "../../../lib";
import { Message, GuildMember } from "discord.js";
import User from "../../models/User";

export default class extends Command {
  constructor(client: Bot) {
    super(client, {
      name: "ban",
      description: "Ban a member",
      category: "Moderation",
      examples: ["@Example#0001 bad boi"],
      args: [new Arg("target", "The target to action", true), new Arg("reason", "The reason for this action")],
      devOnly: false,
      botPerms: ["BAN_MEMBERS"],
      userPerms: ["BAN_MEMBERS"],
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
    const target = (await msg.client.getUserOrMember(args[0], msg.guild)) as GuildMember;
    if (!target) return msg.send("warn", "No target found");
    const reason = args.slice(1).join(" ");

    try {
      await target.ban({ reason });
      const data = (await User.findOne({ id: target.user.id })) || new User({ id: target.user.id });
      data.infractions.push({
        authorID: msg.author.id,
        timestamp: new Date().toDateString(),
        type: "ban",
        reason,
      });
      await data.save();

      await msg.send("success", `Banned ${target} for: \`${reason}\``);
      await Util.modlog("ban", target, msg.member, msg.client, reason);
    } catch (err) {
      await msg.send("warn", `Unable to ban that member: ${err.message}`);
    }

    return { done: true };
  }
}
