import type { Document } from 'mongoose';

export const DefaultAutomodData = {
  enabled: true,
  ignoredRoles: [],
  ignoredChannels: [],
  violations: 3,
  duration: 60,
  threshold: 60,
  action: 'warn',
  punishmentDuration: 30_000,
  shouldLog: true,
  shouldDelete: true,
  shouldAlert: true,
};

export type BaseAutomodData = {
  enabled: boolean;
  ignoredRoles: string[];
  ignoredChannels: string[];
  violations: number;
  duration: number;
  threshold: number;
  action: string;
  punishmentDuration: number;
  shouldLog: boolean;
  shouldDelete: boolean;
  shouldAlert: boolean;
};

export type BannedWordData = BaseAutomodData & {
  bannedWords: Map<string, boolean>;
};

export type LinkData = BaseAutomodData & {
  allowedLinks: string[];
};

export type AutomodData = BaseAutomodData | BannedWordData | LinkData;

export enum AutomodRules {
  BannedWords = 'bannedWords',
  Links = 'links',
}

export type AutomodAction = 'warn' | 'kick' | 'mute' | 'ban';

export enum AutomodActions {
  Warn = 'warn',
  Kick = 'kick',
  Mute = 'mute',
  Ban = 'ban',
}

export type AutomodRule = 'bannedWords' | 'links';

export interface AutomodDocument extends Document {
  _id: string;
  bannedWords: {
    bannedWords: Map<string, boolean>;
    enabled: boolean;
    ignoredRoles: string[];
    ignoredChannels: string[];
    violations: number;
    duration: number;
    threshold: number;
    action: string;
    punishmentDuration: number;
    shouldAlert?: boolean;
    shouldLog?: boolean;
    shouldDelete?: boolean;
  };
}
