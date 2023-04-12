import type { Guild, GuildMember, User } from 'discord.js';

export interface BaseModActionData {
  staff: GuildMember;
  user: GuildMember | User;
  action: modAction;
  caseNum: string;
  reason: string;
}

export type modAction =
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
  guild: Guild;
  member: GuildMember;
  staff: GuildMember;
  action: modAction;
  reason: string;
  length?: number;
}
