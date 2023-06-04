import type {
  AutomodData,
  AutomodRule,
  BannedWordData,
  LinkData,
} from '#lib/types';
import type { Guild } from 'discord.js';
import automodSchema from '../schemas/automod-schema,';

export class Automod {
  public constructor(private readonly guild: Guild) {
    this.guild = guild;
  }

  public async getSettings(
    rule: AutomodRule
  ): Promise<BannedWordData | LinkData | null> {
    let data: AutomodData | null = null;
    const automod = await automodSchema.findOne({ _id: this.guild.id });
    if (!automod) return null;
    switch (rule) {
      case 'bannedWords':
        data = automod.bannedWords as BannedWordData;
    }
    return data as BannedWordData;
  }
}
