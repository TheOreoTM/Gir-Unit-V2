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
  Fail = '<:fail:1093480740571852810>',
  Success = '<:success:1093480744040534046>',
  Prompt = '<:edit:1057359923421380608>',
  Loading = '<a:loading:1096158078900129943>',
  Info = '<:info:1096158656942330006>>',
  Coin = '🪙',
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

export const RecommendedPermissions = 543276137727n;
export const RecommendedPermissionsWithoutAdmin = 543276137719n;
