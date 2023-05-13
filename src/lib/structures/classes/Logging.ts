import { Guild, WebhookClient } from 'discord.js';
import loggingSchema from '../schemas/logging-schema';

export class Logging {
  public constructor(private readonly guild: Guild) {
    this.guild = guild;
  }

  public get automod(): Promise<WebhookClient | null> {
    return (async () => {
      const data = await loggingSchema.findOne({ _id: this.guild.id });
      if (!data) return null;
      if (!data.automod) return null;
      const webhook = new WebhookClient({ url: data.automod.url });
      return webhook;
    })();
  }

  public get message(): Promise<WebhookClient | null> {
    return (async () => {
      const data = await loggingSchema.findOne({ _id: this.guild.id });
      if (!data) return null;
      if (!data.message) return null;
      const webhook = new WebhookClient({ url: data.message.url });
      return webhook;
    })();
  }

  public get server(): Promise<WebhookClient | null> {
    return (async () => {
      const data = await loggingSchema.findOne({ _id: this.guild.id });
      if (!data) return null;
      if (!data.server) return null;
      const webhook = new WebhookClient({ url: data.server.url });
      return webhook;
    })();
  }

  public get member(): Promise<WebhookClient | null> {
    return (async () => {
      const data = await loggingSchema.findOne({ _id: this.guild.id });
      if (!data) return null;
      if (!data.member) return null;
      const webhook = new WebhookClient({ url: data.member.url });
      return webhook;
    })();
  }

  public get channel(): Promise<WebhookClient | null> {
    return (async () => {
      const data = await loggingSchema.findOne({ _id: this.guild.id });
      if (!data) return null;
      if (!data.channel) return null;
      const webhook = new WebhookClient({ url: data.channel.url });
      return webhook;
    })();
  }

  public get role(): Promise<WebhookClient | null> {
    return (async () => {
      const data = await loggingSchema.findOne({ _id: this.guild.id });
      if (!data) return null;
      if (!data.role) return null;
      const webhook = new WebhookClient({ url: data.role.url });
      return webhook;
    })();
  }

  public get moderation(): Promise<WebhookClient | null> {
    return (async () => {
      const data = await loggingSchema.findOne({ _id: this.guild.id });
      if (!data) return null;
      if (!data.moderation) return null;
      const webhook = new WebhookClient({ url: data.moderation.url });
      return webhook;
    })();
  }

  public get transcript(): Promise<WebhookClient | null> {
    return (async () => {
      const data = await loggingSchema.findOne({ _id: this.guild.id });
      if (!data) return null;
      if (!data.transcripts) return null;
      const webhook = new WebhookClient({ url: data.transcripts.url });
      return webhook;
    })();
  }
}
