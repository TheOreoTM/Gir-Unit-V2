import type { ColorResolvable } from 'discord.js';
import 'dotenv/config';

export const Token = process.env.TOKEN;

export const MongoURI = process.env.MONGO_URI;

export const Owners = ['600707283097485322', '395758956091277315'];

export const CooldownFiltered = [...Owners];

export const Prefix = '>';

export const Emojis = {
  'fail': '<:girfail:1093480740571852810>',
  'success': '<:girsuccess:1093480744040534046>',
  'coin': '🪙',
  'prompt': '<:edit:1057359923421380608>',
  'loading': '<:loading:1058130838702805002>',
  'info': '<:info:908907864318423041>',
};

export const GirColors = {
  success: 0x46b485 as ColorResolvable,
  fai: 0xf05050 as ColorResolvable,
  warn: 0xfee65c as ColorResolvable,
  default: 0x2b2d31 as ColorResolvable,
};

export const Presence = {
  name: 'for >help',
  status: 'online',
  type: 3,
};
