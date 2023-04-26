import type { FakeUser } from '#lib/structures';
import {
  GirEvents,
  PunishmentActionData,
  type BaseModActionData,
} from '#lib/types';
import { generateModLogEmbed } from '#lib/utility';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener } from '@sapphire/framework';

@ApplyOptions<Listener.Options>({
  event: GirEvents.ModAction,
})
export class UserListener extends Listener {
  public override run(data: BaseModActionData | PunishmentActionData) {
    return this.sendModLog(data);
  }

  private async sendModLog(data: BaseModActionData | PunishmentActionData) {
    const guild = this.container.client.guilds.cache.get(data.guildId);
    if (!guild) return;

    const channel = await guild.logging?.moderation;
    if (!channel) return;

    const user = guild.members.cache.get(data.memberId);
    const staff = guild.members.cache.get(data.staffId);
    const embed = generateModLogEmbed({
      action: data.action,
      member: user ? user : (user as unknown as FakeUser),
      staff: staff ? staff : (staff as unknown as FakeUser),
      reason: data.reason,
      caseNum: data.caseNum,
      length: data.length ? data.length : null,
    });

    channel.send({ embeds: [embed] });
  }
}
