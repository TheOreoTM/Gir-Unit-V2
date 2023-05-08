import {
  BaseModActionData,
  GirEvents,
  ModlogData,
  type ModAction,
} from '#lib/types';
import { nextCase } from '#lib/utility';
import { container } from '@sapphire/framework';
import type { Guild, GuildMember, Snowflake } from 'discord.js';
import modlogsSchema from '../schemas/modlogs-schema';

export class Modlog {
  guild: Guild;
  member: GuildMember;
  staff: GuildMember;
  action: ModAction;
  reason: string | null;
  length?: number | null;
  caseNum: string = '';
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
    this.reason = reason ? reason : 'No reason';
    this.length = length ? length : null;
  }

  public async create(): Promise<any> {
    this.caseNum = await nextCase(this.guild);

    const modlog = await modlogsSchema.create({
      guildId: this.guild!.id,
      userId: this.member.id,
      userTag: this.member.user.tag,
      staffId: this.staff.id,
      staffTag: this.staff.user.tag,
      reason: this.reason,
      length: this.length ? this.length : null,
      action: this.action,
      caseNum: this.caseNum,
    });

    const data = {
      staffId: this.staff.id,
      staffTag: this.staff.user.tag,
      userId: this.member.id,
      userTag: this.member.user.tag,
      action: this.action,
      caseNum: this.caseNum,
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
      caseNum: caseNum,
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
