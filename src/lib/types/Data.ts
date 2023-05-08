import type { Guild, GuildMember } from 'discord.js';

export interface BaseModActionData {
  guildId: string;
  userId: string;
  userTag: string;
  staffId: string;
  staffTag: string;
  action: ModAction;
  caseNum: string;
  reason: string;
  length?: number;
}

export enum ModActions {
  Kick = 'kick',
  Ban = 'ban',
  Softban = 'softban',
  Unban = 'unban',
  Warn = 'warn',
  Unwarn = 'warn_remove',
  Mute = 'mute',
  Unmute = 'unmute',
  Modnick = 'modnick',
}

export type ModAction =
  | 'kick'
  | 'ban'
  | 'softban'
  | 'unban'
  | 'warn'
  | 'warn_remove'
  | 'mute'
  | 'unmute'
  | 'modnick';

// export type MessageEvents =
// | 'message_delete'
// | 'message_edit'
// | 'image_delete'
// | 'message_bulk_delete'
// |

export interface WarnActionData extends BaseModActionData {
  _id: string; // Warn Id
}

export interface PunishmentActionData extends BaseModActionData {
  expires: NativeDate;
  type: PunishmentType;
}

export interface TaskOptions {
  pattern: string;
  enabled?: boolean;
}

export interface WarnOptions {
  staff: GuildMember;
  reason: string;
}

export interface MuteOptions {
  staff: GuildMember;
  reason?: string;
  /**
   * In milliseconds
   */
}

export interface ModlogData {
  guild: Guild;
  member: GuildMember;
  staff: GuildMember;
  action: ModAction;
  reason: string;
  length?: number | null;
}

export enum PunishmentType {
  Ban = 'ban',
  Mute = 'mute',
  Warn = 'warn',
}
