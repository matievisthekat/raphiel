import { Command, Arg, Bot, CommandRunOptions, CommandResult } from "../../../lib";
import { Message } from "discord.js";
import ReactionRole from "../../models/ReactionRole";

export default class extends Command {
  constructor(client: Bot) {
    super(client, {
      name: "reactionrole",
      aliases: ["rr"],
      description: "Set up a reaction role",
      category: "General",
      examples: ["750716822231318609 @Master :thumbsup:"],
      args: [
        new Arg("message_id", "The ID of the message to set up", true),
        new Arg("role", "The role to set up", true),
        new Arg("emoji", "The emoji to use", true),
      ],
      devOnly: false,
      botPerms: ["ADD_REACTIONS"],
      userPerms: ["MANAGE_ROLES"],
      cooldown: "10s",
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
    const mid = args[0];
    const m = await msg.channel.messages.fetch(mid).catch(() => {});
    const role = await msg.client.getRole(args[1], msg.guild);
    const emoji = args[2];
    if (!m) return await msg.send("warn", `No message with the ID \`${mid}\` was found in this channel`);
    if (!role) return await msg.send("warn", "No role found");

    const emojiID = emoji.replace(/[\\<>]/gi, "").split(":")[2] || emoji;
    const react = await m.react(emojiID).catch(() => {});
    if (!react) return await msg.send("warn", "I cannot use that emoji");

    const data = new ReactionRole({
      emojiID,
      guildID: msg.guild.id,
      chanID: msg.channel.id,
      msgID: mid,
      roleID: role.id,
    });
    await data.save();

    await msg.send("success", `Set up **${role.name}** on \`${mid}\``);
    return { done: true };
  }
}
