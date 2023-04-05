import { ApplyOptions } from '@sapphire/decorators';
import {
  Events,
  Listener,
  MessageCommandDeniedPayload,
  UserError,
} from '@sapphire/framework';

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
    return message.channel.send({
      content,
      allowedMentions: { users: [message.author.id], roles: [] },
    });
  }
}
