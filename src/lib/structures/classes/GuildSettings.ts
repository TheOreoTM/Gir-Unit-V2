import type { Guild } from 'discord.js';
import { Automod } from './Automod';
import { ModerationSettings } from './ModerationSettings';
import { Modnick } from './Modnick';
import { RolesConfig } from './RolesConf';

export class GuildSettings {
  public staffroles: RolesConfig;
  public modnicks: Modnick;
  public moderation: ModerationSettings;
  public automod: Automod;
  // public logs: Logging;
  public constructor(private readonly guild: Guild) {
    this.staffroles = new RolesConfig(this.guild);
    this.modnicks = new Modnick(this.guild);
    this.moderation = new ModerationSettings(this.guild);
    this.automod = new Automod(this.guild);
    // this.logs = new Logging(this.guild);
  }
}
