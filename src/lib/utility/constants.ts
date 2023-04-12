import type { ColorResolvable } from 'discord.js';
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

export const GirEmojis = {
  'fail': '<:girfail:1093480740571852810>',
  'success': '<:girsuccess:1093480744040534046>',
  'coin': '🪙',
  'prompt': '<:edit:1057359923421380608>',
  'loading': '<:loading:1058130838702805002>',
  'info': '<:info:908907864318423041>',
};

export const GirColors = {
  success: 0x46b485 as ColorResolvable,
  fail: 0xf05050 as ColorResolvable,
  warn: 0xfee65c as ColorResolvable,
  default: 0x2b2d31 as ColorResolvable,
};

export const ModColors = {
  mute: GirColors.warn,
  warn: GirColors.warn,
  ban: GirColors.fail,
  softban: GirColors.fail,
  kick: GirColors.fail,
  unban: GirColors.success,
  unmute: GirColors.success,
  warn_remove: GirColors.success,
  modnick: GirColors.warn,
};
// Refactor the #constants and #config
