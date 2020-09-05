import { CustomEvent, Bot, Util } from "../../lib";
import { MessageReaction, User } from "discord.js";

export default class MessageReactionAdd extends CustomEvent {
  constructor(client: Bot) {
    super(client, {
      name: "messageReactionAdd",
      __filename,
    });
  }

  async run(client: Bot, r: MessageReaction, u: User): Promise<void> {
    return await Util.handleReactionRole(false, r, u);
  }
}
