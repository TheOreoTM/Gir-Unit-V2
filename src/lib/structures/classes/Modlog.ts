import type { modAction } from '#lib/types';
import type { Guild, GuildMember, Snowflake } from 'discord.js';
import modlogsSchema from '../schemas/modlogs-schema';

export class Modlog {
  guild: Guild;
  member: GuildMember;
  staff: GuildMember;
  action: modAction;
  reason: string;
  length?: number | null;
  case: string = '';
  public constructor({
    guild,
    member,
    staff,
    action,
    reason,
    length,
  }: {
    guild: Guild;
    member: GuildMember;
    staff: GuildMember;
    action: modAction;
    reason: string;
    length?: number | null;
  }) {
    this.guild = guild;
    this.member = member;
    this.staff = staff;
    this.action = action;
    this.reason = reason.length !== 0 ? reason : 'No reason';
    this.length = length ? length : null;
  }

  public async create(): Promise<any> {
    const caseNum =
      (await modlogsSchema.countDocuments({ guildId: this.guild!.id })) + 1;
    this.case = caseNum.toString();

    const modlog = await modlogsSchema.create({
      guildId: this.guild!.id,
      userId: this.member.id,
      userTag: this.member.user.tag,
      staffId: this.staff.id,
      staffTag: this.staff.user.tag,
      reason: this.reason,
      length: this.length ? this.length : null,
      action: this.action,
      case: this.case,
    });

    return modlog;
  }

  public async getOne(caseNum: string): Promise<any | null> {
    const data = await modlogsSchema.findOne({
      guildId: this.guild.id,
      case: caseNum,
    });

    if (!data) return null;

    if (data) return data;

    return null;
  }

  public async getMany(userId: Snowflake) {
    const data = await modlogsSchema.find({
      userId: userId,
      guildId: this.guild!.id,
    });

    if (!data) return null;
    return data;
  }
}
