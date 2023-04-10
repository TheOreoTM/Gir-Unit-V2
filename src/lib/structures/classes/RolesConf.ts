import type { Guild } from 'discord.js';
import staffRolesShema from '../schemas/staffRoles-shema';

export class RolesConfig {
  public constructor(private readonly guild: Guild) {
    this.guild = guild;
  }

  public get admins() {
    return (async () => {
      const data = await staffRolesShema.findOne({ _id: this.guild.id });
      return data?.admin ?? [];
    })();
  }

  public get mods() {
    return (async () => {
      const data = await staffRolesShema.findOne({ _id: this.guild.id });
      return data?.moderator ?? [];
    })();
  }

  public get staffs() {
    return (async () => {
      const data = await staffRolesShema.findOne({ _id: this.guild.id });
      return data?.staff ?? [];
    })();
  }

  public get trainees() {
    return (async () => {
      const data = await staffRolesShema.findOne({ _id: this.guild.id });
      return data?.trainee ?? [];
    })();
  }
}
