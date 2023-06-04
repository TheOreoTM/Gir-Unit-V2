import {
  GuildMessage,
  ModAction,
  ModerationActionSendOptions,
  PermissionLevels,
} from '#lib/types';
import {
  deleteMessage,
  floatPromise,
  isGuildOwner,
  seconds,
  years,
} from '#lib/utility';
import {
  Args,
  CommandOptionsRunTypeEnum,
  PieceContext,
  UserError,
} from '@sapphire/framework';
import { send } from '@sapphire/plugin-editable-commands';
import { cast } from '@sapphire/utilities';
import type { EmbedBuilder, GuildMember } from 'discord.js';
import { Modlog, SuccessEmbed } from '../classes';
import { GirCommand } from './GirCommand';

export abstract class ModerationCommand<T = unknown> extends GirCommand {
  /**
   * Whether a member is required or not.
   */
  public requiredMember: boolean;

  /**
   * Whether or not this moderation command can create temporary actions.
   */
  public optionalDuration: boolean;

  protected constructor(
    context: PieceContext,
    options: ModerationCommand.Options
  ) {
    super(context, {
      cooldownDelay: seconds(5),
      flags: ['no-author', 'authored'],
      optionalDuration: false,
      permissionLevel: PermissionLevels.Moderator,
      requiredMember: false,
      runIn: [CommandOptionsRunTypeEnum.GuildAny],
      ...options,
    });

    this.requiredMember = options.requiredMember!;
    this.optionalDuration = options.optionalDuration!;
  }

  public messageRun(
    message: GuildMessage,
    args: ModerationCommand.Args,
    context: ModerationCommand.Context
  ): Promise<GuildMessage | null>;
  public async messageRun(message: GuildMessage, args: ModerationCommand.Args) {
    const resolved = await this.resolveOverloads(args);
    const preHandled = await this.prehandle(message, resolved);
    // const processed = [] as Array<{ log: Modlog; target: GuildMember }>;
    // const errored = [] as Array<{ error: Error | string; target: GuildMember }>;
    const GuildSettings = message.guild.settings?.moderation;

    const [shouldAutoDelete, shouldDisplayMessage, shouldDisplayReason] = [
      await GuildSettings?.ModerationAutoDelete,
      await GuildSettings?.ModerationMessageDisplay,
      await GuildSettings?.ModerationReasonDisplay,
    ];

    const { target, ...handledRaw } = resolved;

    try {
      const handled = { ...handledRaw, args, target, preHandled };
      await this.checkModeratable(message, handled);
    } catch (error) {}

    try {
      await this.posthandle(message, { ...resolved, preHandled });
    } catch {
      // noop
    }

    // If the server was configured to automatically delete messages, delete the command and return null.
    if (shouldAutoDelete) {
      if (message.deletable) floatPromise(deleteMessage(message));
    }

    if (shouldDisplayMessage) {
      let embeds: EmbedBuilder[] = [];
      const modlog = new Modlog({
        guild: message.guild,
        member: target,
        staff: message.member,
        action: args.commandContext.commandName as ModAction,
        reason: resolved.reason,
      });

      await modlog.create();

      let content = '';

      content = `Created case ${modlog.caseNum} for ${target.user.username}`;

      if (shouldDisplayReason) content += ` | ${resolved.reason}`;

      embeds = [new SuccessEmbed(content)];
      return send(message, { embeds: embeds });
    }
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected prehandle(
    _message: GuildMessage,
    _context: CommandContext
  ): Promise<T> | T {
    return cast<T>(null);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected posthandle(
    _message: GuildMessage,
    _context: PostHandledCommandContext<T>
  ): unknown {
    return null;
  }

  protected async checkModeratable(
    message: GuildMessage,
    context: HandledCommandContext<T>
  ) {
    if (context.target.id === message.author.id) {
      throw new UserError({
        message: `Why would you do that to yourself?`,
        identifier: `SelfModeration`,
        context: context,
      });
    }

    if (context.target.id === process.env.CLIENT_ID) {
      throw new UserError({
        message: `After everything i've done for you`,
        identifier: `WhyWhy`,
        context: context,
      });
    }

    const member = await message.guild.members
      .fetch(context.target.id)
      .catch(() => {
        if (this.requiredMember)
          throw new UserError({
            message: `I couldn't find that member`,
            identifier: `MemberNotFound`,
            context: context,
          });
        return null;
      });

    if (member) {
      const targetHighestRolePosition = member.roles.highest.position;

      // Gir cannot moderate members with higher role position than it:
      if (
        targetHighestRolePosition >=
        message.guild.members.me!.roles.highest.position
      ) {
        throw new UserError({
          message: `I can't manage that user`,
          identifier: `Hierarchy`,
          context: context,
        });
      }

      // A member who isn't a server owner is not allowed to moderate somebody with higher role than them:
      if (
        !isGuildOwner(message.member) &&
        targetHighestRolePosition >= message.member.roles.highest.position
      ) {
        throw new UserError({
          message: `You can't manage that user`,
          identifier: `Hierarchy`,
          context: context,
        });
      }
    }

    return member;
  }

  protected async getTargetDM(
    message: GuildMessage,
    args: Args
  ): Promise<ModerationActionSendOptions> {
    const GuildSettings = message.guild.settings?.moderation;
    const [nameDisplay, enabledDM] = [
      GuildSettings?.ModerationDisplayName,
      GuildSettings?.ModerationDM,
    ];

    return {
      moderator: args.getFlags('no-author')
        ? null
        : args.getFlags('no-authored') || nameDisplay
        ? message.member
        : null,
      send: (await enabledDM) ? true : false,
    };
  }

  protected async resolveOverloads(
    args: ModerationCommand.Args
  ): Promise<CommandContext> {
    const GuildSettings = args.message.guild!.settings?.moderation;

    return {
      target: await args.pick('member'),
      duration: await this.resolveDurationArgument(args),
      reason: args.finished ? null : await args.rest('string'),
      shouldAutoDelete: await GuildSettings?.ModerationAutoDelete,
      shouldDisplayMessage: await GuildSettings?.ModerationMessageDisplay,
      shouldDisplayReason: await GuildSettings?.ModerationReasonDisplay,
    };
  }

  protected abstract handle(
    message: GuildMessage,
    context: HandledCommandContext<T>
  ): Promise<Modlog> | Modlog;

  private async resolveDurationArgument(args: ModerationCommand.Args) {
    if (args.finished) return null;
    if (!this.optionalDuration) return null;

    const result = await args.pickResult('duration', {
      minimum: 0,
      maximum: years(5),
    });
    if (result.isOk()) return result.unwrap();
    if (result.unwrapErr().identifier === 'InvalidDuration') return null;
    throw result.unwrapErr();
  }
}

export namespace ModerationCommand {
  /**
   * The ModerationCommand Options
   */
  export interface Options extends GirCommand.Options {
    requiredMember?: boolean;
    optionalDuration?: boolean;
  }

  export type Args = GirCommand.Args;
  export type Context = GirCommand.Context;
}

export interface CommandContext {
  target: GuildMember;
  duration: number | null;
  reason: string | null;
  shouldAutoDelete: boolean | undefined;
  shouldDisplayMessage: boolean | undefined;
  shouldDisplayReason: boolean | undefined;
}

export interface HandledCommandContext<T = unknown>
  extends Pick<CommandContext, 'duration' | 'reason'> {
  args: ModerationCommand.Args;
  target: GuildMember;
  preHandled: T;
}

export interface PostHandledCommandContext<T = unknown> extends CommandContext {
  preHandled: T;
}
