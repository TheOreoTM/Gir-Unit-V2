import { ApplyOptions } from '@sapphire/decorators';
import { Events, Listener, ListenerOptions } from '@sapphire/framework';
import type { GuildMember, TextBasedChannel } from 'discord.js';

@ApplyOptions<ListenerOptions>({
  event: Events.GuildMemberAdd,
  name: 'guildMemberAddSendGreeting',
})
export class UserEvent extends Listener {
  public run(member: GuildMember) {
    const channel = member.client.channels.cache.get(
      '1092691212697341952'
    ) as TextBasedChannel;
    if (!channel) return;

    channel.send(`welcome ${member}`);
  }
}
