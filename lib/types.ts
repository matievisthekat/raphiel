import { CommandManager, EventManager, Command } from ".";
import { PermissionString } from "discord.js";
import { Embed } from "./structures/extend/Embed";
import { Logger } from "./structures/Logger";
import { ConnectionOptions } from "mongoose";

export interface ArgOptions {
  name: string;
  desc: string;
  required?: boolean;
}

export type ModLog = "warn" | "mute" | "kick" | "ban";

export interface DatabaseOptions {
  options: ConnectionOptions;
  host: string;
  db: string;
  user: string;
  password: string;
  modelsPath: string;
}

export interface CommandOptions {
  name: string;
  aliases?: Array<string>;
  category: string;
  description: string;
  examples?: Array<string>;
  args?: Array<ArgOptions>;
  usage?: string;
  devOnly?: boolean;
  botPerms?: Array<PermissionString>;
  userPerms?: Array<PermissionString>;
  cooldown?: string;
  __filename?: string;
}

export type CustomMessageType = "warn" | "success" | "error";

export interface EventOptions {
  name: string;
  disabled?: boolean;
  __filename: string;
}

export interface BotOptions {
  token: string;
  prefix: string;
  devs: Array<string>;
  eventDir: string;
  commandDir: string;
  database: DatabaseOptions;
}

export interface CommandRunOptions {
  command: Command;
  args: Array<string>;
  flags: Record<string, boolean>;
}

export interface Config {
  emoji: Record<string, Record<string, string>>;
  colours: {
    default: string;
    green: string;
    red: string;
    yellow: string;
  };
}

export interface CommandResult {
  done: boolean;
}

export interface ExecuteResult {
  stdin: string;
  stdout: string;
  stderr: string;
  error: Error | string;
}

declare module "discord.js" {
  interface Client {
    prefix: string;
    cmd: CommandManager;
    evnt: EventManager;
    config: Config;
    devs: Array<UserResolvable>;
    logger: Logger;
    Embed: Constructable<Embed>;

    getUserOrMember(value: string, guild?: Guild): Promise<User | GuildMember | void>;
    getRole(value: string, guild: Guild): Promise<Role | void>;
    getChannel(
      type: "category" | "text" | "voice" | "news" | "store",
      value: string,
      guild: Guild
    ): GuildChannel | void;
  }

  interface Message {
    emoji(type: string): string;
    format(type: CustomMessageType, msg: string | MessageEmbed): string | MessageEmbed;
    send(
      type: CustomMessageType,
      msg: string | MessageEmbed,
      channel?: TextChannel | DMChannel | NewsChannel
    ): Promise<Message>;
  }

  interface User {
    developer: boolean;
  }
}
