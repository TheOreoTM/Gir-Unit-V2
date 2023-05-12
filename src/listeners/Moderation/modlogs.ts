import type { FakeUser } from '#lib/structures';
import modlogsSchema from '#lib/structures/schemas/modlogs-schema';
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

    const user = guild.members.cache.get(data.userId);
    const staff = guild.members.cache.get(data.staffId);
    const embed = generateModLogEmbed({
      action: data.action,
      member: user ? user : (user as unknown as FakeUser),
      staff: staff ? staff : (staff as unknown as FakeUser),
      reason: data.reason,
      caseNum: data.caseNum,
      length: data.length ? data.length : null,
    });

    const msg = await channel.send({ embeds: [embed] });
    const msg_url = `https://discord.com/channels/${guild.id}/${channel.id}/${msg.id}`;
    await modlogsSchema.findOneAndUpdate(
      { guildId: guild.id, caseNum: data.caseNum },
      { messageId: msg.id, messageUrl: msg_url },
      { upsert: true }
    );
  }
}
