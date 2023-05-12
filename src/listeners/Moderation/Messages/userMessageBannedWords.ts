import { ModerationMessageListener } from '#lib/structures';
import type { GuildMessage } from '#lib/types';
import { ApplyOptions } from '@sapphire/decorators';

@ApplyOptions<ModerationMessageListener.Options>({
  rule: 'bannedWords',
})
export class UserEvent extends ModerationMessageListener {
  protected async preProcess(message: GuildMessage) {
    const words = message.content.split(' ');
    const bannedWords =
      (await message.guild.automod?.getSettings('bannedWords'))?.bannedWords ??
      [];

    const hasBannedWord = words.some((word) => bannedWords.includes(word));

    return hasBannedWord ? true : null;
  }
}
