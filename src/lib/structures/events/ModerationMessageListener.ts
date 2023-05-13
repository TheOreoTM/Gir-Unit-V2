import {
  AutomodData,
  AutomodRule,
  GirEvents,
  GuildMessage,
  ModActions,
  PunishmentType,
} from '#lib/types';
import { floatPromise, nextCase } from '#lib/utility';
import { canSendMessages } from '@sapphire/discord.js-utilities';
// import { isStaff } from '#lib/utility';
import {
  Listener,
  ListenerOptions,
  PieceContext,
  UserError,
} from '@sapphire/framework';
import type { Nullish } from '@sapphire/utilities';
import type {
  Awaitable,
  Channel,
  EmbedBuilder,
  GuildMember,
  WebhookClient,
} from 'discord.js';
import { Modlog } from '../classes';
import punishmentSchema from '../schemas/punishment-schema';

export abstract class ModerationMessageListener<T = unknown> extends Listener {
  private readonly rule: AutomodRule;
  private readonly reason: string;

  public constructor(
    context: PieceContext,
    options: ModerationMessageListener.Options
  ) {
    super(context, { ...options, event: GirEvents.GuildUserMessage });
    this.rule = options.rule;
    this.reason = options.reason;
  }

  public async run(message: GuildMessage) {
    const shouldRun = await this.checkPreRun(message);
    if (!shouldRun) return;

    // if (isStaff(message.member)) return;

    const preProcessed = await this.preProcess(message);
    if (preProcessed === null) return;
    const settings = await message.guild.automod?.getSettings(this.rule);
    if (!settings) return;

    await this.processSoftPunishment(message, settings, preProcessed);

    const currentViolations = await message.member.getHeat(this.rule);
    if (currentViolations! >= settings.violations) {
      if (!settings.action) return;
      await this.processHardPunishment(message, settings);
      //  Take action
    }
  }

  protected async processSoftPunishment(
    message: GuildMessage,
    settings: AutomodData,
    preProcessed: T
  ) {
    await message.member.addHeat(this.rule, settings.duration);
    if (message.deletable && settings.delete) {
      floatPromise(this.onDelete(message, preProcessed) as any);
    }

    if (canSendMessages(message.channel) && settings.alert) {
      floatPromise(this.onAlert(message, preProcessed) as any);
    }

    const webhook: WebhookClient | Nullish = await message.guild.logging
      ?.automod;

    if (webhook && settings.log) {
      floatPromise(this.onLog(message, webhook, preProcessed) as any);
    }
  }

  protected async processHardPunishment(
    message: GuildMessage,
    settings: AutomodData
  ) {
    const action = settings.action;

    switch (action) {
      case ModActions.Warn:
        await this.onWarning(message);
        break;
      case ModActions.Kick:
        await this.onKick(message);
        break;
      case ModActions.Mute:
        await this.onMute(message, settings.punishmentDuration);
        break;
      case ModActions.Ban:
        await this.onBan(message, settings.punishmentDuration);
        break;
    }

    message.member.deleteHeat(this.rule);
  }

  protected async onWarning(message: GuildMessage) {
    const staff =
      message.guild.members.me ?? (await message.guild.members.fetchMe());
    await message.member.warn({
      reason: this.reason,
      staff: staff,
    });
  }

  protected async onKick(message: GuildMessage) {
    const staff =
      message.guild.members.me ?? (await message.guild.members.fetchMe());
    await message.member
      .kick()
      .catch(
        (err) =>
          new UserError({ message: err.message, identifier: 'KickError' })
      );
    await new Modlog({
      guild: message.guild,
      member: message.member,
      staff: staff,
      action: ModActions.Kick,
      reason: this.reason,
    }).create();
  }

  protected async onMute(message: GuildMessage, duration: number = NaN) {
    const staff =
      message.guild.members.me ?? (await message.guild.members.fetchMe());
    await message.member.mute(duration, {
      reason: this.reason,
      staff: staff,
    });
  }

  protected async onBan(message: GuildMessage, duration: number = NaN) {
    const staff =
      message.guild.members.me ?? (await message.guild.members.fetchMe());
    await message.member
      .ban()
      .catch(
        (err) => new UserError({ message: err.message, identifier: 'BanError' })
      );
    await new Modlog({
      guild: message.guild,
      member: message.member,
      staff: staff,
      action: ModActions.Ban,
      reason: this.reason,
    }).create();

    if (duration) {
      let expires: Date;
      expires = new Date();
      expires.setMilliseconds(expires.getMilliseconds() + duration);
      const caseNum = nextCase(message.guild);
      await punishmentSchema.findOneAndUpdate(
        {
          userId: message.member.id,
          guildId: message.guildId,
          type: PunishmentType.Mute,
        },
        {
          userId: message.member.id,
          guildId: message.guildId,
          staffId: staff.id,
          type: PunishmentType.Mute,
          expires: expires,
          caseNum: caseNum,
        },
        {
          upsert: true,
        }
      );
    }
  }

  protected onLog(
    message: GuildMessage,
    webhook: WebhookClient | Nullish,
    value: T
  ): Awaitable<void> {
    this.container.client.emit(
      GirEvents.GuildMessageLog,
      message.guild,
      webhook,
      this.onLogMessage.bind(this, message, value)
    );
  }

  protected abstract preProcess(
    message: GuildMessage
  ): Promise<T | null> | T | null;
  protected abstract onDelete(
    message: GuildMessage,
    value: T
  ): Awaitable<unknown>;
  protected abstract onAlert(
    message: GuildMessage,
    value: T
  ): Awaitable<unknown>;
  protected abstract onLogMessage(
    message: GuildMessage,
    value: T
  ): Awaitable<EmbedBuilder>;

  private async checkPreRun(message: GuildMessage) {
    let enabled: boolean = true;
    if (!message.guild) return false;
    if (!message.guild.automod) return false;
    if (!(await message.guild.automod.getSettings(this.rule))) return false;

    const settings = await message.guild.automod.getSettings(this.rule);
    if (!settings) return false;

    enabled = settings.enabled;

    return (
      enabled &&
      this.checkMessageChannel(settings, message.channel) &&
      this.checkMemberRoles(settings, message.member)
    );
  }

  private checkMessageChannel(settings: AutomodData, channel: Channel) {
    const ignoredChannels = settings.ignoredChannels as readonly string[];
    if (ignoredChannels.includes(channel.id)) return false;

    return true;
  }

  private checkMemberRoles(settings: AutomodData, member: GuildMember | null) {
    if (member === null) return false;

    const ignoredRoles = settings.ignoredRoles;
    if (ignoredRoles.length === 0) return true;

    const { roles } = member;
    return !ignoredRoles.some((id) => roles.cache.has(id));
  }
}

export namespace ModerationMessageListener {
  export interface Options extends ListenerOptions {
    rule: AutomodRule;
    reason: string;
  }
}
