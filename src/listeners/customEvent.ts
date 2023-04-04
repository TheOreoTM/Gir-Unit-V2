import { ApplyOptions } from '@sapphire/decorators';
import { Listener, ListenerOptions } from '@sapphire/framework';

@ApplyOptions<ListenerOptions>({
  name: 'customEvent',
  event: 'myEvent',
})
export class UserEvent extends Listener {
  public run() {
    console.log('myEvent has been ran');
  }
}
