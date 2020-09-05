import { Bot, Util, CustomMessageType } from "../..";
import {
  TextChannel,
  DMChannel,
  NewsChannel,
  MessageEmbed,
  Structures,
  Client,
  PermissionString,
  Message,
} from "discord.js";

Structures.extend(
  "Message",
  (DJSMessage) =>
    class extends DJSMessage {
      // eslint-disable-next-line @typescript-eslint/ban-types
      constructor(client: Bot | Client, data: object, channel: TextChannel | DMChannel) {
        super(client, data, channel);
      }

      /**
       * @param {CustomMessageType} type The type of message to send
       * @param {String|MessageEmbed} msg The message to send
       * @param {TextChannel|DMChannel|NewsChannel} channel The channel to send to
       */
      public async send(
        type: CustomMessageType,
        msg: string | MessageEmbed,
        channel?: TextChannel | DMChannel | NewsChannel
      ): Promise<Message> {
        if (!channel) channel = this.channel;
        return await channel.send(this.format(type, msg));
      }

      /**
       * @param {CustomMessageType} type The type of message to format to
       * @param {String|MessageEmbed} msg The message to format
       */
      public format(type: CustomMessageType, msg: string | MessageEmbed): string | MessageEmbed {
        const colours = {
          warn: "yellow",
          success: "green",
          error: "red",
        };

        if (msg instanceof MessageEmbed) return msg.setColor(colours[type].toUpperCase());
        else return `${this.emoji(type)} ${msg}`;
      }

      /**
       * @param {string} type The type of emoji to search for
       * @returns {string} The emoji string
       * @public
       */
      public emoji(type: string): string {
        const perms: PermissionString = "USE_EXTERNAL_EMOJIS";
        let external = true;

        if (
          this.guild &&
          (!this.guild.me.hasPermission(perms) || !this.guild.me.permissionsIn(this.channel).has(perms))
        ) {
          external = false;
        }

        const emoji = Util.config.emoji[type.toLowerCase()];
        if (!emoji) return "";

        return external ? emoji.custom || emoji.default : emoji.default;
      }
    }
);
