import { GirEvents, type BaseModActionData } from '#lib/types';
import { generateModLogEmbed } from '#lib/utility';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener } from '@sapphire/framework';

@ApplyOptions<Listener.Options>({
  event: GirEvents.ModAction,
})
export class UserListener extends Listener {
  public override run(data: BaseModActionData) {
    return this.sendModLog(data);
  }

  private async sendModLog(data: BaseModActionData) {
    const channel = await data.staff.guild.logging?.moderation;
    if (!channel) return;

    const embed = generateModLogEmbed({
      action: data.action,
      member: data.user,
      staff: data.staff,
      reason: data.reason,
      caseNum: data.caseNum,
    });

    channel.send({ embeds: [embed] });
  }
}
