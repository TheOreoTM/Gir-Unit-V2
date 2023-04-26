import { GirCommand } from '#lib/structures';
import { ApplyOptions } from '@sapphire/decorators';
import { reply } from '@sapphire/plugin-editable-commands';

@ApplyOptions<GirCommand.Options>({
  description: 'A basic command',
  name: 'ping',
})
export class pingCommand extends GirCommand {
  public async messageRun(message: GirCommand.Message) {
    const msg = await reply(message, 'Ping');
    const ping = Math.floor(message.client.ws.ping);

    msg.edit(`Ping \`${ping}ms\``);
  }
}
