import { CooldownFiltered, Prefix, Presence, Token } from '#config';
import prefixSchema from '#root/schemas/prefix-schema';
import { LogLevel, SapphireClient } from '@sapphire/framework';
import { IntentsBitField, Message, Partials } from 'discord.js';

export class GirClient extends SapphireClient {
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
      caseInsensitiveCommands: true,
      defaultCooldown: {
        delay: 5_000,
        filteredUsers: CooldownFiltered,
      },
      presence: {
        activities: [{ name: Presence.name, type: Presence.type }],
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

    const guild = await prefixSchema.findOne({ guild: message.guild.id });

    return guild?.prefix ?? Prefix;
  };
}
