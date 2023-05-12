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

export type AutomodRule = 'bannedWords' | 'links';
