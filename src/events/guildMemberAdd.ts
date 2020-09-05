import { CustomEvent, Bot } from "../../lib/";
import { GuildMember } from "discord.js";
import { MessageEmbed } from "discord.js";
import { TextChannel } from "discord.js";

export default class extends CustomEvent {
  constructor(client: Bot) {
    super(client, {
      name: "guildMemberAdd",
      __filename,
    });
  }

  /**
   * @param {Bot} client The client that received this event
   */
  public async run(client: Bot, member: GuildMember): Promise<void> {
    if (member.guild.id !== process.env["guild.id"]) return;

    const chan = client.channels.cache.get(process.env["guid.welcome.channel.id"]) as TextChannel;
    if (!chan) return;

    await chan.send(
      member.toString(),
      new MessageEmbed()
        .setColor("GREEN")
        .setThumbnail(member.user.displayAvatarURL())
        .setDescription(`Welcome ${member} to **${member.guild.name}**! Enjoy your stay`)
        .setFooter(`Your are member #${member.guild.members.cache.filter((m) => !m.user.bot).size}`)
    );
  }
}
