/* eslint-disable @typescript-eslint/no-unused-vars */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Command, Arg, Bot, CommandRunOptions, CommandResult } from "../../../lib";
import { Message } from "discord.js";
import LevelRole from "../../models/LevelRole";

export default class extends Command {
  constructor(client: Bot) {
    super(client, {
      name: "levelrole",
      description: "Manage levelling roles",
      category: "General",
      examples: ["@Role 25", "@Role null"],
      args: [
        new Arg("role", "The role to manage", true),
        new Arg("level", "The level for that role. Use 'null' to remove the role entirely"),
      ],
      devOnly: false,
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
    const role = await msg.client.getRole(args[0], msg.guild);
    if (!role) return msg.send("warn", "No role found");

    let level: string | number = args[1];
    let data = await LevelRole.findOne({ id: role.id });
    const remove = level.toLowerCase() === "null";

    if (remove) {
      if (!data) return msg.send("warn", "You cannot remove a role that wasn't set as a levelled role");
      else {
        await data.deleteOne();
        await msg.send("success", `Removed **${role.name}** from levelling roles`);
      }
    } else {
      level = parseInt(level);
      if (!level || level <= 0) return msg.send("warn", "You can only set levelled roles to a positive number");
      if (!data) data = new LevelRole({ id: role.id, level });
      data.level = level;
      await data.save();
      await msg.send("success", `**${role.name}** is now a levelled role on level \`${data.level}\``);
    }

    return { done: true };
  }
}
