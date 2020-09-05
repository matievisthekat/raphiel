import { MessageEmbed, MessageEmbedOptions } from "discord.js";
import config from "../../../src/config";

export class Embed extends MessageEmbed {
  constructor(data?: MessageEmbed | MessageEmbedOptions) {
    super(data);

    this.setColor(config.colours.default);
  }

  public get red(): this {
    return this.setColor(config.colours.red);
  }

  public get yellow(): this {
    return this.setColor(config.colours.yellow);
  }

  public get green(): this {
    return this.setColor(config.colours.green);
  }
}
