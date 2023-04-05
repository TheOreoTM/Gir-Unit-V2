import { wait } from '#lib/utility';
import { ApplyOptions } from '@sapphire/decorators';
import {
  Events,
  Listener,
  MessageCommandDeniedPayload,
  UserError,
} from '@sapphire/framework';
import { send } from '@sapphire/plugin-editable-commands';

@ApplyOptions<Listener.Options>({
  event: Events.MessageCommandDenied,
})
export class UserEvent extends Listener {
  public async run(
    { message: content }: UserError,
    { message }: MessageCommandDeniedPayload
  ) {
    // `context: { silent: true }` should make UserError silent:
    // Use cases for this are for example permissions error when running the `eval` command.
    send(message, {
      content,
      allowedMentions: { users: [message.author.id], roles: [] },
    }).then(async (msg) => {
      await wait(7000);
      if (msg.deletable) msg.delete();
      if (message.deletable) message.delete();
      return;
    });
  }
}
