import { ApplyOptions } from '@sapphire/decorators';
import {
  Events,
  Listener,
  LogLevel,
  MessageCommandSuccessPayload,
} from '@sapphire/framework';
import type { Logger } from '@sapphire/plugin-logger';
import { logSuccessCommand } from '../../../lib/utils';

@ApplyOptions<Listener.Options>({
  event: Events.MessageCommandAccepted,
})
export class UserEvent extends Listener<typeof Events.MessageCommandSuccess> {
  public run(payload: MessageCommandSuccessPayload) {
    logSuccessCommand(payload);
  }

  public onLoad() {
    this.enabled = (this.container.logger as Logger).level <= LogLevel.Debug;
    return super.onLoad();
  }
}
