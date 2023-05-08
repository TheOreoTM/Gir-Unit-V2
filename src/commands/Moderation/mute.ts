import { FailEmbed, GirCommand, SuccessEmbed } from '#lib/structures';
import { PermissionLevels } from '#lib/types';
import { checkModeratable } from '#lib/utility';
import { ApplyOptions } from '@sapphire/decorators';
import { send } from '@sapphire/plugin-editable-commands';

@ApplyOptions<GirCommand.Options>({
  description: 'A basic command',
  name: 'mute',
  permissionLevel: PermissionLevels.Staff,
})
export class muteCommand extends GirCommand {
  public override async messageRun(
    message: GirCommand.Message,
    args: GirCommand.Args
  ) {
    const member = await args.pick('member').catch(() => null);
    const duration = await args.pick('duration').catch(() => null);
    const reason = await args.rest('string').catch(() => 'No reason');
    // const muteRole = await message.guild.settings?.moderation.MuteRole;

    const result = await checkModeratable(message, member);
    const target = result.member;

    if (!target) {
      return await send(message, {
        embeds: [new FailEmbed(result.value)],
      });
    }

    if (!result.success) {
      return await send(message, {
        embeds: [new FailEmbed(result.value)],
      });
    }

    await target
      .mute(duration, { staff: message.member, reason: reason })
      .catch(async (err) => {
        return await message.channel.send({ embeds: [new FailEmbed(err)] });
      });

    return await send(message, {
      embeds: [
        new SuccessEmbed(
          `${target.user.tag} was muted ${
            reason !== 'No reason' ? `| ${reason}` : ''
          }`
        ),
      ],
    });
  }
}
