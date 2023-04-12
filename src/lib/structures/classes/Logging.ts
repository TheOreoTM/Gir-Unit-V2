import type { Guild, TextChannel } from 'discord.js';
import loggingSchema from '../schemas/logging-schema';

export class Logging {
  public constructor(private readonly guild: Guild) {
    this.guild = guild;
  }

  public get message(): Promise<TextChannel | null> {
    return (async () => {
      const data = await loggingSchema.findOne({ _id: this.guild.id });
      if (!data) return null;
      return (
        (this.guild.channels.cache.get(data.message) as TextChannel) ?? null
      );
    })();
  }

  public get server(): Promise<TextChannel | null> {
    return (async () => {
      const data = await loggingSchema.findOne({ _id: this.guild.id });
      if (!data) return null;
      return (
        (this.guild.channels.cache.get(data.server) as TextChannel) ?? null
      );
    })();
  }

  public get member(): Promise<TextChannel | null> {
    return (async () => {
      const data = await loggingSchema.findOne({ _id: this.guild.id });
      if (!data) return null;
      return (
        (this.guild.channels.cache.get(data.member) as TextChannel) ?? null
      );
    })();
  }

  public get channel(): Promise<TextChannel | null> {
    return (async () => {
      const data = await loggingSchema.findOne({ _id: this.guild.id });
      if (!data) return null;
      return (
        (this.guild.channels.cache.get(data.channel) as TextChannel) ?? null
      );
    })();
  }

  public get role(): Promise<TextChannel | null> {
    return (async () => {
      const data = await loggingSchema.findOne({ _id: this.guild.id });
      if (!data) return null;
      return (this.guild.channels.cache.get(data.role) as TextChannel) ?? null;
    })();
  }

  public get moderation(): Promise<TextChannel | null> {
    return (async () => {
      const data = await loggingSchema.findOne({ _id: this.guild.id });
      if (!data) return null;
      const channel = this.guild.channels.cache.get(
        data.moderation
      ) as TextChannel;
      return channel;
    })();
  }

  public get transcript(): Promise<TextChannel | null> {
    return (async () => {
      const data = await loggingSchema.findOne({ _id: this.guild.id });
      if (!data) return null;
      return (
        (this.guild.channels.cache.get(data.transcripts) as TextChannel) ?? null
      );
    })();
  }
}
