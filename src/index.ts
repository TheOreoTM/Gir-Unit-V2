import { LogLevel, SapphireClient } from '@sapphire/framework';
import { GatewayIntentBits, Partials } from 'discord.js';
import { connectToMongo } from './lib/utility/functions/connectToMongo';
require('dotenv').config();

const client = new SapphireClient({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Channel],

  logger: {
    level: LogLevel.Debug,
  },

  defaultPrefix: '>',
  disableMentionPrefix: false,
  loadMessageCommandListeners: true,
  caseInsensitiveCommands: true,
  caseInsensitivePrefixes: true,
  enableLoaderTraceLoggings: true,
  loadDefaultErrorListeners: true,
  // typing: true,
});

client.on('ready', async () => {
  // connect to mongo

  await connectToMongo(`${process.env.MONGO_URI}`);
  console.log(`Client ready | ${client.user!.tag}`);
});

const main = async () => {
  try {
    client.logger.info('Logging in');
    await client.login(process.env.TOKEN);
    client.logger.info('Logged in');
  } catch (error) {
    client.logger.fatal(error);
    client.destroy();
    process.exit(1);
  }
};

main();
