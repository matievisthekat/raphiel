import { Command, Arg, Bot, CommandRunOptions, CommandResult, Util } from "../../../lib";
import { Message, User as DJSUser } from "discord.js";
import User from "../../models/User";

export default class extends Command {
  constructor(client: Bot) {
    super(client, {
      name: "infractions",
      aliases: ["warnings", "punishments"],
      description: "View the infractions of a user",
      category: "Moderation",
      examples: ["@Example#0001", ""],
      args: [new Arg("target", "The user to view")],
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
  public async run(msg: Message, { args }: CommandRunOptions): Promise<CommandResult | Message> {
    const target = (await msg.client.getUserOrMember(args.join(" ") || msg.author.toString())) as DJSUser;
    if (!target) return msg.send("warn", "No target user found");

    const data = await User.findOne({ id: target.id });
    if (!data || !data.infractions) return msg.send("warn", `${target.tag} has no infractions`);

    const embed = new msg.client.Embed()
      .setAuthor(target.tag, target.displayAvatarURL({ format: "png" }))
      .setDescription(
        data.infractions
          .map(
            (infr, i) =>
              `**${i + 1}** - ${infr.timestamp}\n\`\`\`Punisher: ${
                msg.guild.members.resolve(infr.authorID)?.user.tag || "invalid-user"
              }\nType: ${Util.capitalise(infr.type)}${infr.reason ? `\nReason: ${infr.reason}` : ""}\`\`\``
          )
          .join("\n")
      );
    await msg.send("success", embed);

    return { done: true };
  }
}
