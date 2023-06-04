import type { Guild, Role } from 'discord.js';
import moderationSettingsSchema from '../schemas/moderationSettings-schema';

export class ModerationSettings {
  public constructor(private readonly guild: Guild) {
    this.guild = guild;
  }

  public get MuteRole(): Promise<Role | null> {
    return (async () => {
      const data = await moderationSettingsSchema.findOne({
        _id: this.guild.id,
      });
      const role =
        this.guild.roles.cache.find((r) => r.id === (data?.muteRole || null)) ||
        this.guild.roles.cache.find((r) => r.name.toLowerCase() === 'muted');
      return role ?? null;
    })();
  }

  public get ModerationDM() {
    return (async () => {
      const data = await moderationSettingsSchema.findOne({
        _id: this.guild.id,
      });
      return data?.dm ?? true;
    })();
  }

  public get ModerationDisplayName() {
    return (async () => {
      const data = await moderationSettingsSchema.findOne({
        _id: this.guild.id,
      });
      return data?.displayName ?? true;
    })();
  }

  public get ModerationAutoDelete() {
    return (async () => {
      const data = await moderationSettingsSchema.findOne({
        _id: this.guild.id,
      });
      return data?.autoDelete ?? false;
    })();
  }

  public get ModerationMessageDisplay() {
    return (async () => {
      const data = await moderationSettingsSchema.findOne({
        _id: this.guild.id,
      });
      return data?.messageDisplay ?? true;
    })();
  }

  public get ModerationReasonDisplay() {
    return (async () => {
      const data = await moderationSettingsSchema.findOne({
        _id: this.guild.id,
      });
      return data?.reasonDisplay ?? true;
    })();
  }
}
