import { Command, Arg, Bot, Util, CommandRunOptions, CommandResult } from "../../../lib";
import { Message, PermissionString, Collection } from "discord.js";
import ms from "ms";

export default class extends Command {
  constructor(client: Bot) {
    super(client, {
      name: "help",
      aliases: ["commands", "cmds"],
      category: "General",
      description: "View all the commands for this bot",
      examples: ["ping", "Music"],
      args: [new Arg("command|category", "The command or category to search for")],
      botPerms: ["SEND_MESSAGES"],
      __filename,
    });
  }

  /**
   * @param {Message} msg The message that fired this command
   * @param {CommandRunOptions} commandArgs The arguments run with every command
   * @param {Command} commandArgs.command The command that was run
   * @param {Array<string>} commandArgs.args The arguments run with the command
   * @param {object} commandArgs.flags The flags run for the command
   * @returns {Promise<CommandResult | Message>} The success status object
   * @public
   */
  public async run(msg: Message, { args }: CommandRunOptions): Promise<CommandResult | Message> {
    const commands = msg.client.cmd.commands;
    const aliases = msg.client.cmd.aliases;

    if (!args[0]) {
      return this.allCommands(msg, commands);
    } else {
      const command = commands.get(args.join(" ")) ?? aliases.get(args.join(" "));
      if (!command)
        return await msg.send(
          "warn",
          `I could not find a command with that name! Use \`${msg.client.prefix}${this.opts.name}\` for a full list of commands`
        );
      return this.singleCommand(msg, command);
    }
  }

  public async allCommands(msg: Message, commands: Collection<string, Command>): Promise<CommandResult | Message> {
    const embed = new msg.client.Embed();
    const categories: Array<string> = [...new Set(commands.map((cmd) => cmd.opts.category.toLowerCase()))];

    for (const category of categories) {
      const categoryCommands = commands.filter((cmd) => cmd.opts.category.toLowerCase() === category);
      if (!categoryCommands) continue;

      embed.addField(
        `${msg.emoji(category)} ${Util.capitalise(category)}`,
        categoryCommands.map((c) => `\`${c.opts.name}\``).join(", ")
      );
    }

    await msg.channel.send(embed);
    return { done: true };
  }

  private async singleCommand(msg: Message, command: Command): Promise<CommandResult | Message> {
    const formatPerms = (perms: Array<PermissionString>): string =>
      perms?.map((perm) => Util.capitalise(perm.replace(/_+/gi, " "))).join(", ") || "None";

    const opts = command.opts;
    const embed = new msg.client.Embed()
      .addField(
        Util.capitalise(`${opts.category}: ${opts.name}`),
        `\`\`\`dust\n${msg.client.prefix}${opts.name} ${opts.usage}\`\`\`${opts.description}`
      )
      .addField(
        "Options",
        `\`\`\`md\n- Aliases: ${opts.aliases?.join(", ") || "None"}\n- Cooldown: ${ms(ms(opts.cooldown), {
          long: true,
        })}\n- Developer Only: ${opts.devOnly ? "Yes" : "No"}\`\`\``
      )
      .addField("User Permissions", formatPerms(opts.userPerms))
      .addField("Bot Permissions", formatPerms(opts.botPerms))
      .addField(
        "Arguments",
        `\`\`\`dust\n${opts.args?.map((a) => `${Util.formatArg(a)} ${a.desc}`).join("\n") || "None"}\`\`\``
      )
      .addField("Examples", opts.examples?.map((ex) => `${msg.client.prefix}${opts.name} ${ex}`).join("\n") || "None")
      .setFooter("{ Required } | < Optional >");

    await msg.channel.send(embed);
    return { done: true };
  }
}
