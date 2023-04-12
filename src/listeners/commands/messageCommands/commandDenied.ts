import { format, sendTemporaryMessage } from '#lib/utility';
import {
  Listener,
  UserError,
  type MessageCommandDeniedPayload,
} from '@sapphire/framework';
import { ms } from 'enhanced-ms';

export class CommandDenied extends Listener {
  public constructor(context: Listener.Context, options: Listener.Options) {
    super(context, {
      ...options,
      event: 'messageCommandDenied',
    });
  }

  public async run(error: UserError, { message }: MessageCommandDeniedPayload) {
    if (Reflect.get(Object(error.context), 'silent')) return;

    if (error.identifier === 'preconditionCooldown') {
      const { remaining } = error.context as { remaining: number };
      return await sendTemporaryMessage(message, {
        content: `${message.author}, a little too quick there. Wait ${ms(
          remaining
        )}`,
      });
    } else if (error.identifier === 'argsMissing') {
      return await sendTemporaryMessage(message, {
        content: `You are missing some arguments`,
      });
    } else if (error.identifier === 'argsUnavailable') {
      return await sendTemporaryMessage(message, {
        content: `Some arguments arent available  `,
      });
    } else if (error.identifier === 'preconditionGuildOnly') {
      return await sendTemporaryMessage(message, {
        content: `This command can only run in guilds`,
      });
    } else if (error.identifier === 'preconditionNsfw') {
      return await sendTemporaryMessage(message, {
        content: `This command can only be used in NSFW channels`,
      });
    } else if (error.identifier === 'preconditionUserPermissions') {
      const { missing } = error.context as { missing: [] };
      return await sendTemporaryMessage(message, {
        content: `You need \`${format(missing).join('` `')}\` permission${
          missing.length - 1 === 0 ? '' : '(s)'
        } to run this command`,
      });
    } else {
      return await message.reply(error.message);
    }
  }
}
