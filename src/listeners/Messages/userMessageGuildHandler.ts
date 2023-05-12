import { GirEvents } from '#lib/types';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener } from '@sapphire/framework';
import type { Message } from 'discord.js';

@ApplyOptions<Listener.Options>({
  event: GirEvents.UserMessage,
})
export class UserEvent extends Listener {
  public override run(message: Message) {
    if (message.guild)
      this.container.client.emit(GirEvents.GuildUserMessage, message);
    console.log('bruh');
  }
}
