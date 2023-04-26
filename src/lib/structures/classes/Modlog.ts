import {
  BaseModActionData,
  GirEvents,
  ModlogData,
  type modAction,
} from '#lib/types';
import { nextCase } from '#lib/utility';
import { container } from '@sapphire/framework';
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
  }: ModlogData) {
    this.guild = guild;
    this.member = member;
    this.staff = staff;
    this.action = action;
    this.reason = reason.length !== 0 ? reason : 'No reason';
    this.length = length ? length : null;
  }

  public async create(): Promise<any> {
    this.case = await nextCase(this.guild);

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

    const data = {
      staffId: this.staff.id,
      staffTag: this.staff.user.tag,
      memberId: this.member.id,
      memberTag: this.member.user.tag,
      action: this.action,
      caseNum: this.case,
      reason: this.reason,
      guildId: this.guild.id,
      length: this.length,
    } as BaseModActionData;

    container.client.emit(GirEvents.ModAction, data);

    return modlog;
  }

  public async getOne(caseNum: string): Promise<any | null> {
    const data = await modlogsSchema.findOne({
      guildId: this.guild.id,
      case: caseNum,
    });

    if (!data) return null;

    return data;
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
