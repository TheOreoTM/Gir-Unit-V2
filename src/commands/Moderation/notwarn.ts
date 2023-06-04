import { FailEmbed, GirCommand, SuccessEmbed } from '#lib/structures';
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
    // const target = await args.pick('member').catch(() => null);

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

    await target
      .warn(
        { reason: reason, staff: message.member },
        { moderator: message.member, send: true }
      )
      .catch(async (err) => {
        await message.channel.send({ embeds: [new FailEmbed(err)] });
        return;
      });

    return await send(message, {
      embeds: [new SuccessEmbed(`${target} has been warned | ${reason}`)],
    });
  }
}
