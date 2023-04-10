import type { Guild, GuildMember, User } from 'discord.js';

export interface BaseModActionData {
  staff: GuildMember;
  user: GuildMember | User;
  reason?: string;
  action: modAction;
}

export type modAction =
  | 'kick'
  | 'ban'
  | 'softban'
  | 'unban'
  | 'timeout'
  | 'warn'
  | 'warn_remove'
  | 'mute'
  | 'unmute'
  | 'modnick';

export interface WarnActionData {
  _id: string; // Warn Id
  guildId: string;
  memberId: string;
  memberTag: string;
  staffId: string;
  staffTag: string;
  reason: string;
  case: string;
  createdAt: NativeDate;
  updatedAt: NativeDate;
}

export interface ModlogData {
  guild: Guild | null;
  member: GuildMember;
  staff: GuildMember;
  action: modAction;
  reason: string;
  length?: number | null;
}
