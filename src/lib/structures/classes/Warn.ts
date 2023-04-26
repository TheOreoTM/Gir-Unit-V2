import type { modAction } from '#lib/types';
import { uid } from '#lib/utility';
import type { Guild, GuildMember } from 'discord.js';
import { Modlog } from './Modlog';

export class Warn {
  // readonly member: GuildMember;
  // readonly staff: GuildMember;
  _id: string = uid(); // Warn Id
  guildId: string;
  memberId: string;
  memberTag: string;
  staffId: string;
  staffTag: string;
  reason: string;
  case: string;

  public constructor(member: GuildMember, mod: GuildMember, reason?: string) {
    // (this.member = member), (this.staff = mod);
    const guildId = member.guild.id || member.id;
    this.guildId = guildId;
    this.memberId = member.id;
    this.memberTag = member.user.tag;
    this.staffId = mod.id;
    this.staffTag = mod.user.tag;
    this.reason = reason ? reason : 'No reason provided';
    this.case = '';
  }

  public async generateModlog(guild: Guild): Promise<Modlog> {
    const staff = guild!.members.cache.get(this.staffId) as GuildMember;
    const member = guild!.members.cache.get(this.memberId) as GuildMember;

    const data = {
      guild: guild,
      member: member,
      staff: staff,
      action: 'warn' as modAction,
      reason: this.reason,
    };
    const caseData = new Modlog(data);
    await caseData.create();
    this.case = caseData.case;
    return caseData;
  }
}
