import { GirColors } from '#constants';
import { ModerationMessageListener } from '#lib/structures';
import type { BannedWordData, GuildMessage } from '#lib/types';
import { deleteMessage, getContent, sendTemporaryMessage } from '#lib/utility';
import { ApplyOptions } from '@sapphire/decorators';
import { EmbedBuilder, TextChannel } from 'discord.js';

@ApplyOptions<ModerationMessageListener.Options>({
  rule: 'bannedWords',
  reason: 'Using banned words',
})
export class UserEvent extends ModerationMessageListener {
  protected async preProcess(message: GuildMessage) {
    const words = getContent(message);
    if (!words) return;
    const bannedWords =
      (
        (await message.guild.automod?.getSettings(
          'bannedWords'
        )) as BannedWordData
      ).bannedWords ?? [];

    const hasBannedWord = words
      .split(' ')
      .some((word) => bannedWords.has(word));

    return hasBannedWord ? true : null;
  }

  protected onDelete(message: GuildMessage) {
    return deleteMessage(message);
  }

  protected onAlert(message: GuildMessage) {
    return sendTemporaryMessage(
      message,
      `${message.member}, That word isnt allowed in this server`
    );
  }

  protected onLogMessage(message: GuildMessage) {
    return new EmbedBuilder()
      .setAuthor({
        name: message.author.username,
        iconURL: message.author.displayAvatarURL(),
      })
      .setColor(GirColors.Warn)
      .setDescription(message.content)
      .setFooter({
        text: `#${
          (message.channel as TextChannel).name
        } | [Auto-Mod] Triggered banned word rule`,
      });
  }
}
