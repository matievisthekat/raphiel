import { ExecuteResult, Arg } from "../";
import { promisify } from "util";
import { exec } from "child_process";
import * as fs from "fs";
import * as path from "path";
import config from "../../src/config";
import { MessageReaction, User } from "discord.js";
import ReactionRole from "../../src/models/ReactionRole";

const realExec = promisify(exec);

export class Util {
  public static config = config;

  /**
   * Capitalise a string or words
   * @param {String} str The string to capitalise
   * @returns {String} The capitalised string
   * @public
   * @static
   */
  public static capitalise(str: string): string {
    return str.length > 0
      ? str
          .split(/ +/gi)
          .map((word: string) => word[0].toUpperCase() + word.slice(1).toLowerCase())
          .join(" ")
      : str;
  }

  /**
   * Load environment variables from a .env.json file
   * @param {String} path The path to the .env.json file
   * @returns {Object} The environment variables
   * @public
   * @static
   */
  public static loadEnv(path: string): Record<string, string> {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const env = require(path);
    if (!env) throw new Error("(Util#loadEnv) No environment variables to load");

    return Util.loadObjectToEnv(env);
  }

  /**
   * Load an object into environment variables
   * @param {Object} obj The object to load
   * @public
   * @static
   */
  public static loadObjectToEnv(obj: unknown): Record<string, string> {
    for (const entry of Object.entries(obj)) {
      if (typeof entry[1] === "object") {
        Util.loadObjectToEnv(entry[1]);
      } else {
        process.env[entry[0]] = entry[1].toString();
      }
    }
    return process.env;
  }

  /**
   * Execute a terminal command
   * @param {String} command The command to execute
   * @returns {Promise<ExecuteResult>} The result of executing the command
   * @public
   * @static
   */
  public static async execute(command: string): Promise<ExecuteResult> {
    let error = null;
    const result = await realExec(command).catch((err) => (error = err));
    return {
      stdin: result?.stdin,
      stdout: result?.stdout,
      stderr: result?.stderr,
      error,
    };
  }

  /**
   * Find all files in a certain directory (nested)
   * @param {String} dir The directory to read
   * @param {String} pattern The file type to look for
   * @returns {Array<string>} An array of file paths
   * @public
   * @static
   */
  public static findNested(dir: string, pattern = "js"): Array<string> {
    let results: Array<string> = [];

    fs.readdirSync(dir).forEach((innerDir) => {
      innerDir = path.resolve(dir, innerDir);
      const stat = fs.statSync(innerDir);

      if (stat.isDirectory()) results = results.concat(Util.findNested(innerDir, pattern));

      if (stat.isFile() && innerDir.split(".").pop() === pattern) results.push(innerDir);
    });

    return results;
  }

  /**
   * Format an argument instance
   * @param {Arg} a The argument instance to format
   */
  public static formatArg(a: Arg): string {
    return `${a.required ? "{" : "<"}${a.name}${a.required ? "}" : ">"}`;
  }

  /**
   * @param {Boolean} remove To remove or add the role
   * @param {MessageReaction} r The reaction emitted
   * @param {User} u THe user that reacted
   * @returns {Promise<void>}
   * @public
   * @static
   */
  public static async handleReactionRole(remove: boolean, r: MessageReaction, u: User): Promise<void> {
    if (u.partial) await u.fetch();
    if (u.bot) return;
    if (r.partial) await r.fetch();
    if (r.message.partial) await r.message.fetch();

    const roles = await ReactionRole.find({ guildID: r.message.guild.id });
    if (!roles || roles.length < 1) return;

    const emoji = r.emoji.id || r.emoji.name;
    const role = roles.find((r) => r.emojiID === emoji);
    if (!role) return;

    if (r.message.id !== role.msgID || emoji !== role.emojiID) return;
    const member = r.message.guild.members.resolve(u);
    await member.roles[remove ? "remove" : "add"](role.roleID).catch(async (err) => {
      r.message.client.logger.error(err.message);
      await u.send(
        r.message.format(
          "warn",
          `Failed to ${remove ? "remove" : "give you"} the <@&${role.roleID}> role: ${err.message}`
        )
      );
    });
  }
}
