import modlogsSchema from '#lib/structures/schemas/modlogs-schema';
import type { Guild } from 'discord.js';

export async function nextCase(guild: Guild): Promise<string> {
  const caseNum =
    (await modlogsSchema.countDocuments({ guildId: guild.id })) + 1;

  return caseNum.toString();
}
