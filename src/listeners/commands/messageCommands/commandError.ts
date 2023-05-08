import { FailEmbed } from '#lib/structures';
import { GirEvents } from '#lib/types';
import { format, sendTemporaryMessage } from '#lib/utility';
import { ApplyOptions } from '@sapphire/decorators';
import {
  Listener,
  MessageCommandErrorPayload,
  UserError,
} from '@sapphire/framework';
import ms from 'enhanced-ms';

@ApplyOptions<Listener.Options>({
  event: GirEvents.MessageCommandError,
})
export class UserListener extends Listener {
  public override async run(
    error: UserError,
    { message }: MessageCommandErrorPayload
  ) {
    let content = '';
    if (error instanceof UserError) {
      if (Reflect.get(Object(error.context), 'silent')) return;

      if (error.identifier === 'preconditionCooldown') {
        const { remaining } = error.context as { remaining: number };
        return await sendTemporaryMessage(message, {
          content: `${message.author}, a little too quick there. Wait ${ms(
            remaining
          )}`,
        });
      } else if (error.identifier === 'argsMissing') {
        content = `You are missing some arguments`;
      } else if (error.identifier === 'argsUnavailable') {
        content = `Some arguments arent available`;
      } else if (error.identifier === 'preconditionGuildOnly') {
        content = `This command can only run in guilds`;
      } else if (error.identifier === 'preconditionNsfw') {
        content = `This command can only be used in NSFW channels`;
      } else if (error.identifier === 'preconditionUserPermissions') {
        const { missing } = error.context as { missing: [] };
        content = `You need \`${format(missing).join('` `')}\` permission${
          missing.length - 1 === 0 ? '' : '(s)'
        } to run this command`;
      } else {
        return await sendTemporaryMessage(message, {
          embeds: [
            new FailEmbed(content === '' ? error.message : content).setTitle(
              error.identifier
            ),
          ],
        });
      }

      await sendTemporaryMessage(message, {
        embeds: [new FailEmbed(error.message).setTitle(error.identifier)],
      });
    }
    return undefined;
  }
}
