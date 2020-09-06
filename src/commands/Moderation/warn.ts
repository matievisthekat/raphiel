import { Command, Arg, Bot, CommandRunOptions, CommandResult, Util } from "../../../lib";
import { Message, GuildMember } from "discord.js";

export default class extends Command {
  constructor(client: Bot) {
    super(client, {
      name: "warn",
      description: "Warn a member",
      category: "Moderation",
      examples: ["@Example#0001 bad boi"],
      args: [new Arg("target", "The target to action", true), new Arg("reason", "The reason for this action")],
      devOnly: false,
      userPerms: ["MANAGE_MESSAGES"],
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

    await msg.send(
      "warn",
      `You have been warned by ${msg.author} in **${msg.guild.name}** for: \`${reason}\``,
      target.user.dmChannel || (await target.user.createDM())
    );
    await Util.modlog("mute", target, msg.member, msg.client, reason);

    await msg.send("success", `Warned ${target.user.tag} for: \`${reason}\``);
    return { done: true };
  }
}
