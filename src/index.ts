import { SapphireClient } from '@sapphire/framework';
import { GatewayIntentBits } from 'discord.js';
require('dotenv').config();

const client = new SapphireClient({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
  defaultPrefix: '>',
  disableMentionPrefix: false,
  loadMessageCommandListeners: true,
});

client.login(process.env.TOKEN);
