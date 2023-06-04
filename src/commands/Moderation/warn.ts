import { ModerationCommand } from '#lib/structures';

import { ApplyOptions } from '@sapphire/decorators';
import type { ArgumentTypes } from '@sapphire/utilities';

@ApplyOptions<ModerationCommand.Options>({
  aliases: ['w', 'warning'],
  description: ``,
  detailedDescription: {},
  requiredMember: true,
})
export class UserModerationCommand extends ModerationCommand {
  public async handle(
    ...[message, context]: ArgumentTypes<ModerationCommand['handle']>
  ) {
    console.log('ewafsefs');
    return await context.target.warn(
      {
        reason: context.reason,
        staff: message.member,
      },
      await this.getTargetDM(message, context.args)
    );
  }
}
