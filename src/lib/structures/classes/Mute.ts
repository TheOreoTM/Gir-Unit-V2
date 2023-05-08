import { ModActions, ModlogData, PunishmentType } from '#lib/types';
import { UserError } from '@sapphire/framework';
import type { Guild, GuildMember } from 'discord.js';
import punishmentSchema from '../schemas/punishment-schema';
import { Modlog } from './Modlog';

export class Mute {
  guild: Guild;
  guildId: string;
  memberId: string;
  memberTag: string;
  staffId: string;
  staffTag: string;
  reason: string | undefined;
  duration: number | null;
  caseNum: string = '';
  public constructor({
    target,
    staff,
    reason,
    duration,
  }: {
    target: GuildMember;
    staff: GuildMember;
    reason: string | undefined;
    duration?: number | null;
  }) {
    this.guildId = staff.guild.id;
    this.memberId = target.id;
    this.memberTag = target.user.tag;
    this.staffId = staff.id;
    this.staffTag = staff.user.tag;
    this.reason = reason ? reason : 'No reason';
    this.duration = duration ? duration : NaN;

    const guild = staff.guild;
    if (!guild) throw 'Something went wrong';
    this.guild = guild;
  }
  public async create() {
    const member = this.guild.members.cache.get(this.memberId);
    let error: string = '';
    if (!member) {
      error = 'Provide a valid user';
      throw new UserError({ identifier: 'InvalidUser', message: error });
    }

    const muteRole = await this.guild.settings?.moderation.MuteRole;

    if (!muteRole) {
      error = `I couldn't find a \`Muted\` role in the server`;
      throw new UserError({ identifier: 'InvalidRole', message: error });
    }

    await member.roles.add([muteRole]).catch(async (err: Error) => {
      error = err.message;
      throw new UserError({ identifier: 'PermissionError', message: error });
    });

    await this.generateModlog();

    // If is temporary
    if (this.duration) {
      let expires: Date;
      expires = new Date();
      expires.setMilliseconds(expires.getMilliseconds() + this.duration);
      await punishmentSchema.findOneAndUpdate(
        {
          userId: this.memberId,
          guildId: this.guildId,
          type: PunishmentType.Mute,
        },
        {
          userId: this.memberId,
          guildId: this.guildId,
          staffId: this.staffId,
          type: PunishmentType.Mute,
          expires: expires,
          caseNum: this.caseNum,
        },
        {
          upsert: true,
        }
      );
    }
  }

  private async generateModlog() {
    const staff = this.guild!.members.cache.get(this.staffId) as GuildMember;
    const member = this.guild.members.cache.get(this.memberId) as GuildMember;
    const data: ModlogData = {
      guild: this.guild,
      member: member,
      staff: staff,
      action: ModActions.Mute,
      reason: this.reason ? this.reason : 'No reason',
      length: this.duration,
    };
    const caseData = new Modlog(data);
    await caseData.create();
    this.caseNum = caseData.caseNum;
    return caseData;
  }
}
