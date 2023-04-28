import { GirEvents } from '#lib/types';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener } from '@sapphire/framework';
import { get } from '@sapphire/plugin-editable-commands';
import type { Message } from 'discord.js';

@ApplyOptions<Listener.Options>({
  event: GirEvents.MessageDelete,
})
export class UserListener extends Listener {
  public override run(message: Message) {
    if (!message.guild) return;

    const response = get(message);
    if (!response) return;
    if (!response.deletable) return;

    return response.deletable ? response.delete() : null;
  }
}
