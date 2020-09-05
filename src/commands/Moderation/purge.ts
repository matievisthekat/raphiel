import { Command, Arg, Bot, CommandRunOptions, CommandResult } from "../../../lib";
import { Message } from "discord.js";
import { TextChannel } from "discord.js";

export default class extends Command {
  constructor(client: Bot) {
    super(client, {
      name: "purge",
      description: "Purge messages from a channel",
      category: "Moderation",
      examples: ["3", "100 492708936290402305"],
      args: [
        new Arg("amount", "The amount of messages to fetch", true),
        new Arg("user_id", "The id of the user to delete the messages from"),
      ],
      devOnly: false,
      botPerms: ["MANAGE_MESSAGES"],
      userPerms: ["MANAGE_MESSAGES"],
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
    const uid = args[1];
    let msgs = await msg.channel.messages.fetch({ limit: parseInt(args[0]) });
    if (uid) msgs = msgs.filter((m) => m.author.id === uid);
    if (!msgs) return await msg.send("warn", "No message(s) found");

    (msg.channel as TextChannel)
      .bulkDelete(msgs.array().slice(0, 100))
      .then(
        async (deleted) => await msg.send("success", `Deleted ${deleted.size} message(s)${uid ? ` from <@${uid}>` : ""}`)
      )
      .catch(async (err) => await msg.send("warn", `Failed to delete message(s): ${err.message}`));

    return { done: true };
  }
}
