import { GirCommand, SuccessEmbed } from '#lib/structures';
import { Warn } from '#lib/structures/classes/Warn';
import { PermissionLevels } from '#lib/types';
import { ApplyOptions } from '@sapphire/decorators';
import { UserError } from '@sapphire/framework';
import { send } from '@sapphire/plugin-editable-commands';

@ApplyOptions<GirCommand.Options>({
  description: 'A basic command',
  name: 'warn',
  permissionLevel: PermissionLevels.Trainee,
})
export class UserCommand extends GirCommand {
  public async messageRun(message: GirCommand.Message, args: GirCommand.Args) {
    if (!message.member) return;
    if (!message.guild) return;
    const target = await args.pick('member').catch(() => null);

    if (!target) {
      throw new UserError({
        identifier: 'MissingArgs',
        message: 'Provide a user for the warn',
      });
    }

    const reason = await args.rest('string').catch(() => null);

    if (!reason) {
      throw new UserError({
        identifier: 'MissingArgs',
        message: 'Provide a reason for the warn',
      });
    }

    const warn = new Warn(target, message.member, reason);
    await warn.generateModlog(message.guild);

    return await send(message, {
      embeds: [
        new SuccessEmbed(`${target.user.tag} has been warned | ${reason}`),
      ],
    });
  }
}
