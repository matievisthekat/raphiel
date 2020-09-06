import { Command, Bot, CommandRunOptions, CommandResult } from "../../../lib";
import { Message } from "discord.js";
import Level from "../../models/Level";
import { MessageEmbed } from "discord.js";

export default class extends Command {
  constructor(client: Bot) {
    super(client, {
      name: "leaderboard",
      aliases: ["lb"],
      description: "Experience leaderboard",
      category: "General",
      devOnly: false,
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
  public async run(msg: Message): Promise<CommandResult | Message> {
    const levels = (await Level.find()).sort((a, b) => b.xp - a.xp).slice(0, 10);
    await msg.send(
      "success",
      new msg.client.Embed().setDescription(
        levels.map((l, i) => `**${i + 1}** - <@${l.uid}> - *Level ${l.level}, ${l.xp} xp*`).join("\n")
      )
    );

    return { done: true };
  }
}
