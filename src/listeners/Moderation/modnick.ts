import { GirEvents } from '#lib/types';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener } from '@sapphire/framework';
import { AuditLogEvent, GuildMember } from 'discord.js';

@ApplyOptions<Listener.Options>({
  event: GirEvents.GuildMemberUpdate,
})
export class UserEvent extends Listener {
  public async run(oldMember: GuildMember, newMember: GuildMember) {
    if (oldMember.partial) oldMember = await oldMember.fetch();
    if (newMember.partial) newMember = await newMember.fetch();

    const conditions =
      (oldMember.nickname && !newMember.nickname) || // * Member removed nickname
      (!oldMember.nickname && newMember.nickname) || // * Member added Nickname
      (oldMember.nickname &&
        newMember.nickname &&
        oldMember.nickname !== newMember.nickname); // * Member changed nickname

    if (!conditions) return;
    const logs = await oldMember.guild
      .fetchAuditLogs({
        type: AuditLogEvent.MemberUpdate,
        limit: 1,
      })
      .catch(() => null);

    const entry = logs?.entries.first();

    if (!logs || !entry) return;

    if (entry.executor?.id !== entry.target?.id) return;

    const modnickData = await oldMember.guild.settings?.modnicks.get(
      oldMember.id
    );

    if (!modnickData || !modnickData.frozen) return;

    const nickname = modnickData.nickname;

    if (!nickname) return;

    await newMember.setNickname(nickname, 'Frozen Nickname').catch(() => null);
  }
}
