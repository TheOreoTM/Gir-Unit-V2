import { wait } from '#lib/utility';
import { ApplyOptions } from '@sapphire/decorators';
import {
  Events,
  Identifiers,
  Listener,
  MessageCommandDeniedPayload,
  UserError,
} from '@sapphire/framework';
import { send } from '@sapphire/plugin-editable-commands';
import ms from 'enhanced-ms';

@ApplyOptions<Listener.Options>({
  event: Events.MessageCommandDenied,
})
export class UserEvent extends Listener {
  public async run(
    { message: content, identifier, context }: UserError,
    { message }: MessageCommandDeniedPayload
  ) {
    if (identifier === Identifiers.PreconditionCooldown) {
      const { remaining } = context as { remaining: number };
      await send(
        message,
        `${message.author}, a little too quick there. Wait ${ms(remaining, {
          shortFormat: true,
        })}.`
      ).then(async (msg) => {
        await wait(6000);
        if (msg.deletable) await msg.delete();
        return;
      });
    } else {
      send(message, {
        content,
        allowedMentions: { users: [message.author.id], roles: [] },
      }).then(async (msg) => {
        await wait(6000);
        if (msg.deletable) msg.delete();
        if (message.deletable) message.delete();
        return;
      });
      return;
    }
  }
}
