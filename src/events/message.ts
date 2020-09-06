import { CustomEvent, Bot, Command, CommandResult } from "../../lib";
import { Message } from "discord.js";
import ms from "ms";
import { PermissionString } from "discord.js";
import { GuildMember } from "discord.js";
import Level from "../models/Level";
import LevelRole from "../models/LevelRole";

export default class Ready extends CustomEvent {
  constructor(client: Bot) {
    super(client, {
      name: "message",
      __filename,
    });
  }

  /**
   * run
   * @param {Bot} client The client that received this message
   * @param {Message} msg The message that was sent
   * @returns A promise
   * @public
   */
  public async run(client: Bot, msg: Message): Promise<unknown> {
    // If the message wasn't in a guild, wasn't send by a human or doesn't start with the prefix then return
    if (!msg.guild || msg.webhookID || msg.author.bot) return false;

    // Get the args and command strings from the message content
    const [rawCommand, ...rawArgs] = msg.content.slice(client.prefix.length).trim().split(/ +/gi);

    // Define flags, filter args and get the command
    const flags = {};
    const flagArgs = rawArgs.filter((a) => a.startsWith("--"));
    const args = rawArgs.filter((a) => !a.startsWith("--"));
    const command = client.cmd.get(rawCommand);
    flagArgs.map((flag) => (flags[flag.slice(2)] = true));

    if (command && msg.content.startsWith(msg.client.prefix)) {
      // If the author is not a developer and the command is locked to devOnly send an error
      if (command.opts.devOnly && !msg.author.developer) {
        return await msg.send("warn", "That command is locked to developers only!");
      }

      const hasPerms = await permissionChecks(msg, command);
      const hasArgs = await argChecks(msg, args, command);
      const passedCooldown = await cooldownChecks(msg, command);

      if (hasPerms !== true || hasArgs !== true || passedCooldown !== true) return;

      // Run the command once all checks are complete
      const res = (await command.run(msg, { command, args, flags })) as CommandResult;
      if (res && res.done === true) {
        command.emit("run", msg, { command, args, flags });
      }
    } else {
      const data = (await Level.findOne({ uid: msg.author.id })) || new Level({ uid: msg.author.id });
      data.xp += Math.round(Math.random() * 10);
      data.level = Math.floor(data.xp / 100);
      await data.save();

      const roles = await LevelRole.find();
      const role = roles.filter((r) => data.level >= r.level).sort((a, b) => b.level - a.level)[0];

      if (role) await msg.member.roles.add(role.id).catch(() => {});
    }
  }
}

async function levelChecks(msg: Message) {}

async function permissionChecks(msg: Message, command: Command): Promise<Message | boolean> {
  // Get the required permissions for the command. Defaulting to SEND_MESSAGES
  const botPerms = command.opts.botPerms ?? ["SEND_MESSAGES"];
  const userPerms = command.opts.userPerms ?? ["SEND_MESSAGES"];

  const hasPerm = (perm: PermissionString | Array<PermissionString>, member?: GuildMember): boolean =>
    member.hasPermission(perm) || member.permissionsIn(msg.channel).has(perm);
  // Check for permissions in the current guild and channel
  if (!hasPerm(botPerms, msg.guild.me)) {
    // If the bot is missing the SEND_MESSAGES permission
    const missingSend =
      !msg.guild.me.hasPermission("SEND_MESSAGES") || !msg.guild.me.permissionsIn(msg.channel).has("SEND_MESSAGES");

    // Send an error message to the current channel or the author's DM channel
    return await msg.send(
      "warn",
      `I am missing one or more of the following permissions (\`${botPerms}\`) to execute that command ${
        missingSend ? `in **${msg.guild.name}**` : ""
      }`,
      // If the bot is missing SEND_MESSAGES permission it sends a message to the author's DM channel (creating on if it doesn't exist)
      missingSend ? msg.author.dmChannel ?? (await msg.author.createDM()) : msg.channel
    );

    // Check user perms in the current guild and channel
  } else if (!hasPerm(userPerms, msg.member)) {
    return await msg.send(
      "warn",
      `You are missing one or more of the following permissions (\`${userPerms}\`) to execute that command`
    );
  }

  return true;
}

async function argChecks(msg: Message, args: Array<string>, command: Command): Promise<Message | boolean> {
  // Check command arguments
  if (command.opts.args && command.opts.args.length > 0) {
    for (let i = 0; i < command.opts.args.length; i++) {
      const arg = command.opts.args[i];
      if (!args[i] && arg.required)
        return await msg.send(
          "warn",
          `You are missing the argument **${arg.name}**. Correct usage \`${msg.client.prefix}${command.opts.name} ${command.opts.usage}\``
        );
    }
  }

  return true;
}

async function cooldownChecks(msg: Message, command: Command): Promise<Message | boolean> {
  // Get the cooldown for the message author on that command
  const cooldown = command.cooldown.get(msg.author.id);

  // If they are on cooldown check if its expired
  if (cooldown && command.opts.cooldown) {
    // Calc timeout in ms
    const timeout = ms(command.opts.cooldown) - (Date.now() - cooldown);
    if (timeout > 0) {
      // Get timeout in readable form
      const timeoutLong = ms(timeout, { long: true });
      // Send the error
      return await msg.send(
        "warn",
        `The cooldown for that command has not expired! Please wait **${timeoutLong}** before using it again`
      );
    } else {
      // Remove the cooldown
      command.cooldown.delete(msg.author.id);
    }
  }

  return true;
}
