import { GirEvents } from '#lib/types';
import { logSuccessCommand } from '#lib/utility';
import { ApplyOptions } from '@sapphire/decorators';
import {
  Listener,
  LogLevel,
  MessageCommandSuccessPayload,
} from '@sapphire/framework';
import type { Logger } from '@sapphire/plugin-logger';

@ApplyOptions<Listener.Options>({
  event: GirEvents.MessageCommandAccepted,
})
export class UserEvent extends Listener {
  public run(payload: MessageCommandSuccessPayload) {
    logSuccessCommand(payload);
  }

  public onLoad() {
    this.enabled = (this.container.logger as Logger).level <= LogLevel.Debug;
    return super.onLoad();
  }
}
