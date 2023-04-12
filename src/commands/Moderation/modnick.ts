import { GirCommand, SuccessEmbed } from '#lib/structures';
import { PermissionLevels } from '#lib/types';
import { runAllChecks } from '#lib/utility';
import { ApplyOptions } from '@sapphire/decorators';
import { send } from '@sapphire/plugin-editable-commands';

@ApplyOptions<GirCommand.Options>({
  description: 'A basic command',
  name: 'modnick',
  permissionLevel: PermissionLevels.Trainee,
  flags: ['freeze', 'f', 'frozen'],
})
export class UserCommand extends GirCommand {
  public async messageRun(message: GirCommand.Message, args: GirCommand.Args) {
    const frozen = args.getFlags('freeze', 'f', 'frozen');
    const member = await args.pick('member');
    const nick = await args.rest('string').catch(() => undefined);

    const pass = runAllChecks(message.member, member, 'modnick');
    if (!pass.result) {
      return send(message, { embeds: [pass.content] });
    }

    const output = await message.guild?.settings?.modnicks.create(
      member,
      message.member,
      nick,
      frozen
    );

    return await send(message, {
      embeds: [
        new SuccessEmbed(
          `User with ID \`${
            member.id
          }\` has been modnicked with the identifier \`${
            output?.identifier
          }\` ${frozen ? '❄️' : ''}`
        ),
      ],
    });
  }
}
