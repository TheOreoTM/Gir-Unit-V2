import { CooldownFiltered } from '#constants';
import {
  BucketScope,
  ClientLoggerOptions,
  CooldownOptions,
  LogLevel,
  SapphirePrefix,
} from '@sapphire/framework';
import {
  ActivityType,
  ClientOptions,
  GatewayIntentBits,
  MessageMentionOptions,
  Partials,
  PresenceData,
} from 'discord.js';
import 'dotenv/config';
import { sec } from './functions';

export const Token = process.env.TOKEN;

export const MongoURI = process.env.MONGO_URI as string;

export const Prefix = '>';

export const Presence = {
  activities: [{ name: `for ${Prefix}help`, type: ActivityType.Watching }],
  status: 'online',
} as PresenceData;

export const config: Config = {
  default_prefix: Prefix,
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildMembers,
  ],
  cooldown_options: {
    delay: sec(5),
    filteredUsers: CooldownFiltered,
    scope: BucketScope.User,
  },
  mentions: {
    parse: ['users'],
    repliedUser: false,
  },
  partials: [
    Partials.GuildMember,
    Partials.Message,
    Partials.User,
    Partials.Channel,
  ],
  logger: {
    level: LogLevel.Info,
  },

  presence: Presence,
};

export const ClientConfig: ClientOptions = {
  intents: config.intents,
  defaultPrefix: config.default_prefix,
  allowedMentions: config.mentions,
  caseInsensitiveCommands: true,
  caseInsensitivePrefixes: true,
  defaultCooldown: config.cooldown_options,
  partials: config.partials,
  logger: config.logger,
  loadMessageCommandListeners: true,
  typing: false,
  disableMentionPrefix: false,
  preventFailedToFetchLogForGuilds: true,
  presence: config.presence,
};

interface Config {
  intents: GatewayIntentBits[];
  cooldown_options: CooldownOptions;
  mentions: MessageMentionOptions;
  partials: Partials[];
  logger: ClientLoggerOptions;
  presence: PresenceData;
  default_prefix: SapphirePrefix;
}
