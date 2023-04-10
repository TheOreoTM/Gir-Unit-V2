import { GirCommand } from '#lib/structures';
import { PermissionLevels } from '#lib/types';
import { ApplyOptions } from '@sapphire/decorators';

@ApplyOptions<GirCommand.Options>({
  description: 'A basic command',
  preconditions: ['Staff'],
  permissionLevel: PermissionLevels.Trainee,
})
export class UserCommand extends GirCommand {
  public async messageRun(message: GirCommand.Message, args: GirCommand.Args) {
    const member = await args.pick('member');
    const nick = await args.rest('string');
    message.guild?.settings?.modnicks.create(member, message.member, nick);
  }
}
