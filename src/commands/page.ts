import { GirCommand, GirPaginatedMessage } from '#lib/structures';
import { ApplyOptions } from '@sapphire/decorators';

@ApplyOptions<GirCommand.Options>({
  description: 'A basic command',
  name: 'page',
})
export class UserCommand extends GirCommand {
  public async messageRun(message: GirCommand.Message) {
    if (!message.member) return;
    const msg = new GirPaginatedMessage()
      .addPageContent('Test')
      .addPageContent('test2');

    return msg.run(message);
  }
}
