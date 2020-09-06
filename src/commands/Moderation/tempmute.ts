import { Command, Arg, Bot, CommandRunOptions, CommandResult, Util } from "../../../lib";
import { Message } from "discord.js";
import { GuildMember } from "discord.js";
import ms from "ms";

export default class extends Command {
  constructor(client: Bot) {
    super(client, {
      name: "tempmute",
      aliases: ["tm"],
      description: "Temp mute someone",
      category: "Moderation",
      examples: ["@Exampel#0001 10m"],
      args: [new Arg("target", "The member to mute", true), new Arg("duration", "The duration to mute them for", true)],
      devOnly: false,
      botPerms: ["MANAGE_ROLES"],
      userPerms: ["MANAGE_ROLES"],
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
    const timeout = ms(args[1]);
    if (!timeout) return msg.send("warn", "Please supply a valid timeout");

    const role = msg.guild.roles.cache.find((r) => r.name.toLowerCase() === "muted");
    if (!role)
      return msg.send("warn", "No muted role found. Please make sure you have a role called 'Muted' in this server");

    try {
      await target.roles.add(role);

      setTimeout(async () => await target.roles.remove(role), timeout);

      await msg.send("success", `Muted ${target.user.tag} for ${ms(timeout, { long: true })}`);

      await Util.modlog("mute", target, msg.member, msg.client, null, timeout);
    } catch (err) {
      msg.client.logger.error(err);
      await msg.send("warn", `Failed to mute the member: ${err.message}`);
    }

    return { done: true };
  }
}
