import { GirCommand } from '#lib/structures';
import { ApplyOptions } from '@sapphire/decorators';

@ApplyOptions<GirCommand.Options>({
  description: 'A basic command',
  name: 'test2'
})
export class test2Command extends GirCommand {
  public override async messageRun(
    message: GirCommand.Message,
    args: GirCommand.Args
  ) {
    const arg1 = await args.pick('string');
    return message.channel.send(arg1);
  }
}
