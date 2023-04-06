import { Owners, Prefix, Presence, Token } from '#config';
import { LogLevel, SapphireClient } from '@sapphire/framework';
import { IntentsBitField, Message, Partials } from 'discord.js';
import { model } from 'mongoose';

export class RveinClient extends SapphireClient {
  constructor() {
    super({
      defaultPrefix: Prefix,
      allowedMentions: {
        parse: ['users'],
        repliedUser: true,
      },
      intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.DirectMessages,
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.GuildPresences,
        IntentsBitField.Flags.GuildVoiceStates,
      ],
      partials: [Partials.Channel],
      shardCount: 2,
      caseInsensitiveCommands: true,
      defaultCooldown: {
        delay: 5_000,
        filteredUsers: Owners,
      },
      presence: {
        activities: [{ name: Presence.name }],
      },
      loadMessageCommandListeners: true,
      loadDefaultErrorListeners: false,
      logger: { level: LogLevel.Debug },
    });
  }
  async start() {
    try {
      await this.login(Token);
    } catch (error) {
      this.logger.fatal(error);
      this.destroy();
      process.exit(1);
    }
  }

  public fetchPrefix = async (message: Message) => {
    if (!message.guild) return Prefix;

    const guild = await model.findOne({ guild: message.guild.id });

    return guild?.prefix ?? Prefix;
  };
}
