import { FailEmbed } from '#lib/structures';
import { GirEvents } from '#lib/types';
import { ApplyOptions } from '@sapphire/decorators';
import {
  Listener,
  MessageCommandErrorPayload,
  UserError,
} from '@sapphire/framework';
import { send } from '@sapphire/plugin-editable-commands';

@ApplyOptions<Listener.Options>({
  event: GirEvents.MessageCommandError,
})
export class UserListener extends Listener {
  public override async run(
    error: UserError,
    { message }: MessageCommandErrorPayload
  ) {
    if (error instanceof UserError) {
      if (!Reflect.get(Object(error.context), 'silent'))
        return send(message, { embeds: [new FailEmbed(error.message)] });
    }
    return undefined;
  }
}
