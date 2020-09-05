import { CustomEvent, Bot } from "../../lib";
import ReactionRole from "../models/ReactionRole";
import { TextChannel } from "discord.js";

export default class Ready extends CustomEvent {
  constructor(client: Bot) {
    super(client, {
      name: "ready",
      __filename,
    });
  }

  async run(client: Bot): Promise<void> {
    const roles = await ReactionRole.find();
    for (const role of roles) {
      const guild = await client.guilds.fetch(role.guildID).catch(() => {});
      if (!guild) {
        await role.deleteOne();
        continue;
      }

      const chan = guild.channels.cache.get(role.chanID) as TextChannel;
      if (!chan) {
        await role.deleteOne();
        continue;
      }

      const msgs = await chan.messages.fetch().catch(() => {});
      if (!msgs) {
        await role.deleteOne();
        continue;
      }

      if (!msgs.has(role.msgID)) {
        await role.deleteOne();
        continue;
      }
    }

    return client.logger.log(
      `Logged in as ${client.user.tag} with ${client.guilds.cache.size} guilds`
    );
  }
}
