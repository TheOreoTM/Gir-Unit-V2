import type { ModlogData } from '#lib/types';
import { UserError } from '@sapphire/framework';
import type { Guild, GuildMember } from 'discord.js';
import { Modlog } from './Modlog';

export class Mute {
  guild: Guild;
  guildId: string;
  memberId: string;
  memberTag: string;
  staffId: string;
  staffTag: string;
  reason: string;
  duration: number | null;
  case: string = '';
  public constructor({
    target,
    staff,
    reason,
    duration,
  }: {
    target: GuildMember;
    staff: GuildMember;
    reason: string;
    duration?: number | null;
  }) {
    this.guildId = staff.guild.id;
    this.memberId = target.id;
    this.memberTag = target.user.tag;
    this.staffId = staff.id;
    this.staffTag = staff.user.tag;
    this.reason = reason;
    this.duration = duration ? duration : NaN;

    const guild = staff.guild;
    if (!guild) throw 'Something went wrong';
    this.guild = guild;
  }
  public async init() {
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

    return await this.generateModlog();
  }

  private async generateModlog() {
    const staff = this.guild!.members.cache.get(this.staffId) as GuildMember;
    const member = this.guild.members.cache.get(this.memberId) as GuildMember;
    const data: ModlogData = {
      guild: this.guild,
      member: member,
      staff: staff,
      action: 'mute',
      reason: this.reason,
      length: this.duration,
    };
    const caseData = new Modlog(data);
    await caseData.create();
    this.case = caseData.case;
    return caseData;
  }
}
