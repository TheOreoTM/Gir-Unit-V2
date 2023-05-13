export type BaseAutomodData = {
  enabled: boolean;
  ignoredRoles: string[];
  ignoredChannels: string[];
  violations: number;
  duration: number;
  threshold: number;
  action: string;
  bannedWords: string[];
  allowedLinks: string[];
  punishmentDuration: number;
  log: boolean;
  delete: boolean;
  alert: boolean;
};

export type BannedWordData = BaseAutomodData & {
  bannedWords: string[];
};

export type LinkData = BaseAutomodData & {
  allowedLinks: string[];
};

export type AutomodData = BaseAutomodData | BannedWordData | LinkData;

export enum AutomodRules {
  BannedWords = 'bannedWords',
  Links = 'links',
}

export type AutomoAction = 'warn' | 'kick' | 'mute' | 'ban';

export enum AutomodActions {
  Warn = 'warn',
  Kick = 'kick',
  Mute = 'mute',
  Ban = 'ban',
}

export type AutomodRule = 'bannedWords' | 'links';
