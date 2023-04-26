import { FailEmbed, GirCommand, Mute } from '#lib/structures';
import { checkModeratable } from '#lib/utility';
import { ApplyOptions } from '@sapphire/decorators';
import { send } from '@sapphire/plugin-editable-commands';

@ApplyOptions<GirCommand.Options>({
  description: 'A basic command',
  name: 'mute',
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

    // if (!muteRole) {
    //   return await send(message, {
    //     embeds: [
    //       new FailEmbed(`I couldn't find a \`Muted\` role in the server`),
    //     ],
    //   });
    // }

    // await target.roles.add([muteRole]).catch(async () => {
    //   return await send(message, {
    //     embeds: [new FailEmbed('Something went wrong')],
    //   });
    // });

    const mute = new Mute({ reason, staff: message.member, target, duration });
    await mute.init();

    return await send(message, { content: `${JSON.stringify(mute, null, 2)}` });
  }
}
