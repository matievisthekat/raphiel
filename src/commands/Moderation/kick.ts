import { Command, Arg, Bot, CommandRunOptions, CommandResult, Util } from "../../../lib";
import { Message, GuildMember } from "discord.js";

export default class extends Command {
  constructor(client: Bot) {
    super(client, {
      name: "kick",
      description: "Kick a member",
      category: "Moderation",
      examples: ["@Example#0001 bad boi"],
      args: [new Arg("target", "The target to action", true), new Arg("reason", "The reason for this action")],
      devOnly: false,
      botPerms: ["KICK_MEMBERS"],
      userPerms: ["KICK_MEMBERS"],
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
      await target.kick(reason);
      await msg.send("success", `Kicked ${target} for: \`${reason}\``);
      await Util.modlog("kick", target, msg.member, msg.client, reason);
    } catch (err) {
      await msg.send("warn", `Unable to kick that member: ${err.message}`);
    }

    return { done: true };
  }
}
