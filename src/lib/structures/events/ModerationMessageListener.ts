import { AutomodData, AutomodRule, GirEvents, GuildMessage } from '#lib/types';
// import { isStaff } from '#lib/utility';
import { Listener, ListenerOptions, PieceContext } from '@sapphire/framework';
import type { Channel, GuildMember } from 'discord.js';

export abstract class ModerationMessageListener<T = unknown> extends Listener {
  private readonly rule: AutomodRule;

  public constructor(
    context: PieceContext,
    options: ModerationMessageListener.Options
  ) {
    super(context, { ...options, event: GirEvents.GuildUserMessage });
    this.rule = options.rule;
  }

  public async run(message: GuildMessage) {
    const shouldRun = await this.checkPreRun(message);
    if (!shouldRun) return;

    // if (isStaff(message.member)) return;

    const preProcessed = await this.preProcess(message);
    if (preProcessed === null) return;
    const settings = await message.guild.automod?.getSettings(this.rule);
    await message.member.addHeat(this.rule, settings?.duration!);

    const currentViolations = await message.member.getHeat(this.rule);
    console.log(currentViolations);
    if (currentViolations! >= settings!.violations) {
      message.channel.send('Taking action action action');
      //  Take action
    }
  }

  protected abstract preProcess(
    message: GuildMessage
  ): Promise<T | null> | T | null;

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
  }
}
