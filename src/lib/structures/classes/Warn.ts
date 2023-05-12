import { ModActions } from '#lib/types';
import { uid } from '#lib/utility';
import type { Guild, GuildMember } from 'discord.js';
import warnSchema from '../schemas/warn-schema';
import { Modlog } from './Modlog';

export class Warn {
  // readonly member: GuildMember;
  // readonly staff: GuildMember;
  _id: string = uid(); // Warn Id
  guildId: string;
  userId: string;
  userName: string;
  staffId: string;
  staffName: string;
  reason: string;
  caseNum: string;

  public constructor(member: GuildMember, mod: GuildMember, reason?: string) {
    // (this.member = member), (this.staff = mod);
    const guildId = member.guild.id || member.id;
    this.guildId = guildId;
    this.userId = member.id;
    this.userName = member.user.username;
    this.staffId = mod.id;
    this.staffName = mod.user.username;
    this.reason = reason ? reason : 'No reason';
    this.caseNum = '';
  }

  public async generateModlog(guild: Guild): Promise<Modlog> {
    const staff = guild!.members.cache.get(this.staffId) as GuildMember;
    const member = guild!.members.cache.get(this.userId) as GuildMember;

    const data = {
      guild: guild,
      member: member,
      staff: staff,
      action: ModActions.Warn,
      reason: this.reason,
    };
    const caseData = new Modlog(data);
    await caseData.create();
    this.caseNum = caseData.caseNum;
    await warnSchema.create({
      _id: this._id,
      guildId: this.guildId,
      userId: this.userId,
      userName: this.userName,
      staffId: this.staffId,
      staffName: this.staffName,
      reason: this.reason,
      caseNum: this.caseNum,
    });
    return caseData;
  }
}
