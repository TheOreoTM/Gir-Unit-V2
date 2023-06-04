import { join } from 'path';

export const rootDir = join(__dirname, '..', '..');
export const srcDir = join(rootDir, 'src');

export const ZeroWidthSpace = '\u200B';
export const LongWidthSpace = '\u3000';

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

export const GirClientID = '679323237997608982';
export const GirDevClientID = '730006258563940364';
export const GirUsername = 'Gir-Unit';
export const GirAvatar =
  'https://cdn.discordapp.com/attachments/1095696384348410007/1105191621525508146/gir-unit-avatar.png';

export const enum GirEmojis {
  Fail = '<:fail:1093480740571852810>',
  Success = '<:success:1093480744040534046>',
  Prompt = '<:edit:1057359923421380608>',
  Loading = '<a:loading:1096158078900129943>',
  Info = '<:info:1096158656942330006>',
  Coin = '🪙',
  Left = '◀️',
  Right = '▶️',
  Forward = '⏩',
  Backward = '⏪',
  Stop = '⏹️',
  C4Empty = '<:c4empty:1109863756638474351>',
  C4PlayerOne = '<:c4one:1109863872569032704>',
  C4WinnerOne = '<:c4onewin:1109864001963303033>',
  C4PlayerTwo = '<:c4two:1109863929838047273>',
  C4WinnerTwo = '<:c4twowin:1109864141713313872>',
  On = '<:on:1111978402405175376>',
  Off = '<:off:1111978397585907732>',
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

export const PetShinyChance = 1 / 1024;
export const PetUrl = 'https://gir.up.railway.app/pet/';
