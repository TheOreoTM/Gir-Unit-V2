import type { Guild } from 'discord.js';
import { Modnick } from './Modnick';
import { RolesConfig } from './RolesConf';

export class GuildSettings {
  public staffroles: RolesConfig;
  public modnicks: Modnick;
  public constructor(private readonly guild: Guild) {
    this.staffroles = new RolesConfig(this.guild);
    this.modnicks = new Modnick(this.guild);
  }
}
