import { join } from 'path';

export const rootDir = join(__dirname, '..', '..');
export const srcDir = join(rootDir, 'src');

export const RandomLoadingMessage = [
  'Computing...',
  'Thinking...',
  'Give me a moment',
  'Loading...',
];

export const Token = process.env.TOKEN;

export const MongoURI = process.env.MONGO_URI;

export const Owners = ['600707283097485322', '395758956091277315'];

export const CooldownFiltered = [...Owners];

export const Prefix = '>';

export const enum GirEmojis {
  Fail = '<:girFail:1093480740571852810>',
  Success = '<:girSuccess:1093480744040534046>',
  Coin = '🪙',
  Prompt = '<:edit:1057359923421380608>',
  Loading = '<:loading:1058130838702805002>',
  Info = '<:info:908907864318423041>',
  Left = '◀️',
  Right = '▶️',
  Forward = '⏩',
  Backward = '⏪',
  Stop = '⏹️',
}

export const enum GirColors {
  Success = 0x46b485,
  Fail = 0xf05050,
  Warn = 0xfee65c,
  Default = 0x2b2d31,
}

export const ModColors = {
  mute: GirColors.Warn,
  warn: GirColors.Warn,
  ban: GirColors.Fail,
  softban: GirColors.Fail,
  kick: GirColors.Fail,
  unban: GirColors.Success,
  unmute: GirColors.Success,
  warn_remove: GirColors.Success,
  modnick: GirColors.Warn,
};
// Refactor the #constants and #config
