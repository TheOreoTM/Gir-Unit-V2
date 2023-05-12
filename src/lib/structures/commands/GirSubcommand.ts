// import type { GuildSettings } from '#lib/structures';
// import type { GuildMessage } from '#lib/types';
import type { GuildSettings, Modnick } from '#lib/structures';
import { PermissionLevels, type GuildMessage } from '#lib/types';
import {
  ApplicationCommandRegistry,
  CommandOptionsRunTypeEnum,
  PreconditionContainerArray,
  Args as SapphireArgs,
  UserError,
  type MessageCommandContext,
} from '@sapphire/framework';
import { Subcommand } from '@sapphire/plugin-subcommands';
import {
  AutocompleteInteraction,
  ContextMenuCommandInteraction as CTXMenuCommandInteraction,
  ChatInputCommandInteraction as ChatInputInteraction,
  MessageContextMenuCommandInteraction as MessageCTXCommandInteraction,
  PermissionFlagsBits,
  PermissionsBitField,
  UserContextMenuCommandInteraction as UserCTXMenuCommandInteraction,
} from 'discord.js';
import type { Automod } from '../classes/Automod';
import type { Logging } from '../classes/Logging';
export abstract class GirSubcommand extends Subcommand {
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

  public constructor(
    context: Subcommand.Context,
    options: GirSubcommand.Options
  ) {
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

  protected error(identifier: string | UserError, context?: unknown): never {
    throw typeof identifier === 'string'
      ? new UserError({ identifier, context })
      : identifier;
  }

  protected parseConstructorPreConditions(
    options: GirSubcommand.Options
  ): void {
    super.parseConstructorPreConditions(options);
    this.parseConstructorPreConditionsPermissionLevel(options);
    if (options.community) {
      this.preconditions.append('Community');
    }
  }

  protected parseConstructorPreConditionsPermissionLevel(
    options: GirSubcommand.Options
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
export namespace GirSubcommand {
  /**
   * The GirCommand Options
   */
  export type Options = Subcommand.Options & {
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
  export type Context = Subcommand.Context;

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
}
declare module 'discord.js' {
  interface Guild {
    settings: GuildSettings | null;
    logging: Logging | null;
    automod: Automod | null;
    modnicks: Modnick | null;
  }
}
