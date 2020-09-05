import { Command, Arg, Bot, CommandRunOptions, CommandResult } from "../../../lib";
import { Message } from "discord.js";
import ms from "ms";
import { TextChannel } from "discord.js";

export default class extends Command {
  constructor(client: Bot) {
    super(client, {
      name: "lockdown",
      aliases: ["lock"],
      description: "Lockdown a channel",
      category: "Moderation",
      examples: ["5m", "1h"],
      args: [new Arg("timeout", "The timeout to unlock the channel", true)],
      devOnly: false,
      botPerms: ["MANAGE_CHANNELS"],
      userPerms: ["MANAGE_CHANNELS"],
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
    const timeout = ms(args[0]);
    if (!timeout) return await msg.send("warn", "Please supply a valid timeout");

    const chan = msg.channel as TextChannel;
    const previousPerms = chan.permissionOverwrites;

    for (const role of msg.guild.roles.cache.array()) {
      await chan
        .updateOverwrite(role, {
          SEND_MESSAGES: false,
        })
        .then(() =>
          setTimeout(async () => {
            const perm = previousPerms.get(role.id);
            await chan.updateOverwrite(role, {
              SEND_MESSAGES: perm?.allow.has("SEND_MESSAGES") || null,
            });
          }, timeout)
        )
        .catch(() => {});
    }

    await msg.send(
      "success",
      `Locked down this channel for **${ms(timeout, {
        long: true,
      })}**. If some roles can still talk here it means I cannot manage them`
    );
    setTimeout(async () => {
      await msg.send("success", "Channel has been unlocked!");
    }, timeout);

    return { done: true };
  }
}
