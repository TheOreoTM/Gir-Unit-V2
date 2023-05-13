// import type { GuildSettings } from '#lib/structures';
// import type { GuildMessage } from '#lib/types';
import { GuildSettings, Mute, Warn } from '#lib/structures';
import {
  AutomodRule,
  MuteOptions,
  PermissionLevels,
  WarnOptions,
  type GuildMessage,
} from '#lib/types';
import { sec } from '#lib/utility';
import {
  ApplicationCommandRegistry,
  Command,
  CommandOptionsRunTypeEnum,
  PreconditionContainerArray,
  Args as SapphireArgs,
  UserError,
  type MessageCommandContext,
} from '@sapphire/framework';
import {
  AutocompleteInteraction,
  ContextMenuCommandInteraction as CTXMenuCommandInteraction,
  ChatInputCommandInteraction as ChatInputInteraction,
  GuildMember,
  Message,
  MessageContextMenuCommandInteraction as MessageCTXCommandInteraction,
  PermissionFlagsBits,
  PermissionsBitField,
  UserContextMenuCommandInteraction as UserCTXMenuCommandInteraction,
} from 'discord.js';
import type { Logging } from '../classes/Logging';
import heatSchema from '../schemas/heat-schema';
export abstract class GirCommand extends Command {
  /**
   * Whether the command can be disabled.
   */
  public readonly guarded?: boolean;
  /**
   * Whether the command is hidden from everyone.
   */
  public readonly hidden?: boolean;
  /**
   * The permission level required to run the command.
   */
  public readonly permissionLevel?: PermissionLevels;
  /**
   * Whether the command is only for community servers.
   */
  public readonly community?: boolean;

  public constructor(context: Command.Context, options: GirCommand.Options) {
    const perms = new PermissionsBitField(
      options.requiredClientPermissions
    ).add(
      PermissionFlagsBits.SendMessages,
      PermissionFlagsBits.EmbedLinks,
      PermissionFlagsBits.ViewChannel
    );
    super(context, {
      generateDashLessAliases: true,
      requiredClientPermissions: perms,
      runIn: [CommandOptionsRunTypeEnum.GuildAny],
      ...options,
    });
    (this.guarded = options.guarded ?? false),
      (this.hidden = options.hidden ?? false),
      (this.permissionLevel =
        options.permissionLevel ?? PermissionLevels.Everyone),
      (this.community = options.community ?? false);
  }

  public async prefix(message: Message) {
    return await this.container.client.fetchPrefix(message);
  }

  protected error(identifier: string | UserError, context?: unknown): never {
    throw typeof identifier === 'string'
      ? new UserError({ identifier, context })
      : identifier;
  }

  protected parseConstructorPreConditions(options: GirCommand.Options): void {
    super.parseConstructorPreConditions(options);
    this.parseConstructorPreConditionsPermissionLevel(options);
    if (options.community) {
      this.preconditions.append('Community');
    }
  }

  protected parseConstructorPreConditionsPermissionLevel(
    options: GirCommand.Options
  ): void {
    if (options.permissionLevel === PermissionLevels.BotOwner) {
      this.preconditions.append('BotOwner');
      return;
    }

    const container = new PreconditionContainerArray(
      ['BotOwner'],
      this.preconditions
    );
    switch (options.permissionLevel ?? PermissionLevels.Everyone) {
      case PermissionLevels.Everyone:
        container.append('Everyone');
        break;
      case PermissionLevels.Trainee:
        container.append('Trainee');
        break;
      case PermissionLevels.Staff:
        container.append('Staff');
        break;
      case PermissionLevels.Moderator:
        container.append('Moderator');
        break;
      case PermissionLevels.Administrator:
        container.append('Administrator');
        break;
      case PermissionLevels.ServerOwner:
        container.append('ServerOwner');
        break;
      default:
        throw new Error(
          `GirCommand[${this.name}]: "permissionLevel" was specified as an invalid permission level (${options.permissionLevel}).`
        );
    }

    this.preconditions.append(container);
  }
}
export namespace GirCommand {
  /**
   * The GirCommand Options
   */
  export type Options = Command.Options & {
    /**
     * Whether the command can be disabled.
     */
    guarded?: boolean;
    /**
     * Whether the command is hidden from everyone.
     */
    hidden?: boolean;
    /**
     * The permission level required to run the command.
     */
    permissionLevel?: number;
    /**
     * Whether the command is only for community servers.
     */
    community?: boolean;
  };
  export type MessageContext = MessageCommandContext;
  export type ChatInputCommandInteraction = ChatInputInteraction<'cached'>;
  export type ContextMenuCommandInteraction =
    CTXMenuCommandInteraction<'cached'>;
  export type UserContextMenuCommandInteraction =
    UserCTXMenuCommandInteraction<'cached'>;
  export type MessageContextMenuCommandInteraction =
    MessageCTXCommandInteraction<'cached'>;
  export type AutoComplete = AutocompleteInteraction;
  export type Context = Command.Context;

  export type Args = SapphireArgs;
  export type Message = GuildMessage;
  export type Registry = ApplicationCommandRegistry;
}

declare module '@sapphire/framework' {
  interface Preconditions {
    BotOwner: never;
    Everyone: never;
    Trainee: never;
    Staff: never;
    Moderator: never;
    Administrator: never;
    ModeratorCommand: never;
    ServerOwner: never;
    Community: never;
  }
  export interface DetailedDescriptionCommand {
    usage: string;
    examples: string[];
    extendedHelp?: boolean;
  }
  interface ArgType {
    commandCategory: string;
    duration: number;
  }
}

declare module 'discord.js' {
  interface Guild {
    settings: GuildSettings | null;
    logging: Logging | null;
  }
  interface GuildMember {
    warn(options: WarnOptions): Promise<GuildMember>;
    mute(duration: number | null, options: MuteOptions): Promise<GuildMember>;
    addHeat(
      rule: AutomodRule,
      expiresAfterSeconds: number
    ): Promise<GuildMember>;
    getHeat(rule?: AutomodRule): Promise<number>;
    deleteHeat(rule: AutomodRule): Promise<GuildMember>;
  }
}

GuildMember.prototype.getHeat = async function (rule?: AutomodRule) {
  let violations: number = 0;
  if (rule) {
    violations = await heatSchema.countDocuments({
      memberId: this.id,
      guildId: this.guild.id,
      rule: rule,
    });
  } else {
    violations = await heatSchema.countDocuments({
      memberId: this.id,
      guildId: this.guild.id,
    });
  }

  return violations;
};

GuildMember.prototype.deleteHeat = async function (rule: AutomodRule) {
  await heatSchema.deleteMany({
    memberId: this.id,
    guildId: this.guild.id,
    rule: rule,
  });

  return this;
};

GuildMember.prototype.addHeat = async function (
  rule: AutomodRule,
  expiresAfterSeconds: number
) {
  await heatSchema.create({
    memberId: this.id,
    guildId: this.guild.id,
    rule: rule,
    expiresAt: new Date(Date.now() + sec(expiresAfterSeconds)),
  });
  return this;
};

GuildMember.prototype.warn = async function (
  options: WarnOptions
): Promise<GuildMember> {
  const warn = new Warn(this, options.staff, options.reason);
  await warn.generateModlog(this.guild);
  return this;
};

GuildMember.prototype.mute = async function (
  duration: number | null,
  options: MuteOptions
): Promise<GuildMember> {
  const mute = new Mute({
    target: this,
    staff: options.staff,
    reason: options.reason,
    duration: duration,
  });
  await mute.create();
  return this;
};
