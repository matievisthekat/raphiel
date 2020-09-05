import { Command, Arg, Bot, CommandRunOptions, CommandResult } from "../../../lib";
import { Message, User as DJSUser } from "discord.js";
import { createCanvas, loadImage } from "canvas";
import User from "../../models/User";
import Level from "../../models/Level";

export default class extends Command {
  constructor(client: Bot) {
    super(client, {
      name: "profile",
      description: "View your or someone else's profile card",
      category: "Profile",
      examples: ["@Example#0001", ""],
      args: [new Arg("user", "The user to view")],
      devOnly: false,
      botPerms: ["ATTACH_FILES"],
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
    const u = (await msg.client.getUserOrMember(args.join(" ") || msg.author.toString())) as DJSUser;
    if (!u) return msg.send("warn", "No target found");

    const data = await User.findOne({ id: u.id });
    if (!data) return msg.send("warn", "That user doesn't have a profile");
    const lvl = await Level.findOne({ uid: u.id });

    const canvas = createCanvas(734, 458);
    const ctx = canvas.getContext("2d");

    ctx.font = "25px Indie Flower";

    const bg = await loadImage(data.bgUrl);
    ctx.drawImage(bg, 0, 0, 734, 458);

    const avatar = await loadImage(u.displayAvatarURL({ format: "png" }));
    ctx.drawImage(avatar, 20, 20, 125, 125);

    ctx.fillText(
      [
        `Name: ${msg.guild.members.resolve(u).displayName || u.username}`,
        `Level: ${lvl?.level ?? 0}`,
        `XP: ${lvl?.xp ?? 0}`,
        `Member Since: ${msg.guild.members.resolve(u).joinedAt.toDateString()}`,
        `Description: ${data.desc}`,
      ].join("\n"),
      20,
      175
    );

    await msg.channel.send("", {
      files: [
        {
          name: `profile.${data.bgUrl.split(".").pop() || "png"}`,
          attachment: canvas.toBuffer(),
        },
      ],
    });

    return { done: true };
  }
}
