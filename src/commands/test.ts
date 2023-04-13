import { GirCommand } from '#lib/structures';
import { ApplyOptions } from '@sapphire/decorators';

@ApplyOptions<GirCommand.Options>({
  description: 'A basic command',
})
export class UserCommand extends GirCommand {
  public override async messageRun(
    message: GirCommand.Message,
    args: GirCommand.Args
  ) {
    const arg1 = await args.pick('string');
    return message.channel.send(arg1);
  }
}
