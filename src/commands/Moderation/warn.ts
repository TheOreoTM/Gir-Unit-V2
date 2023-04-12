import { GirCommand } from '#lib/structures';
import { Warn } from '#lib/structures/classes/Warn';
import { PermissionLevels } from '#lib/types';
import { ApplyOptions } from '@sapphire/decorators';

@ApplyOptions<GirCommand.Options>({
  description: 'A basic command',
  name: 'warn',
  permissionLevel: PermissionLevels.Trainee,
})
export class UserCommand extends GirCommand {
  public async messageRun(message: GirCommand.Message, args: GirCommand.Args) {
    if (!message.member) return;
    if (!message.guild) return;
    const target = await args.pick('member');

    const reason = await args.rest('string');

    const warn = new Warn(target, message.member, reason);
    await warn.generateModlog(message.guild);

    return await message.channel.send(
      `\`\`\`json\n${JSON.stringify(warn, null, 2)}\`\`\``
    );
  }
}
