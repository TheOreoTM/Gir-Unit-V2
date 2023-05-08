import { FailEmbed, Modlog, Task } from '#lib/structures';
import punishmentSchema from '#lib/structures/schemas/punishment-schema';
import { ModlogData, PunishmentType, TaskOptions } from '#lib/types';
import { ApplyOptions } from '@sapphire/decorators';

// import { Cron } from 'croner';
@ApplyOptions<TaskOptions>({
  pattern: '*/2 * * * * *',
})
export class ExpiredMuteTask extends Task {
  public async run(): Promise<void> {
    if (!this.client.isReady()) return;

    const now = new Date();
    const query = {
      expires: { $lt: now },
    };
    const punishments = await punishmentSchema.find(query);
    await punishmentSchema.deleteMany(query);
    if (punishments.length === 0) return;

    for (const punishment of punishments) {
      const { guildId, userId, type, caseNum } = punishment;
      const guild =
        this.client.guilds.cache.get(guildId) ||
        (await this.client.guilds.fetch(guildId));
      if (!guild) {
        console.log('no guild');
        continue;
      }
      if (type === PunishmentType.Mute) {
        const member =
          guild.members.cache.get(userId) ||
          (await guild.members.fetch(userId));
        if (!member) {
          console.log('no member');
          continue;
        }
        const muteRole = await guild.settings?.moderation.MuteRole;
        if (!muteRole) {
          const moderationLog = await guild.logging?.moderation;
          if (!moderationLog) {
            console.log('no moderation log channel');
            continue;
          }

          const warningEmbed = new FailEmbed(
            `Failed to unmute \`${userId}\` - \`#${caseNum}\` with reason: No mute role found`
          );
          await moderationLog.send({ embeds: [warningEmbed] });
          console.log('no mute role');
          continue;
        }
        // All checks passed, start the unmute process

        await member.roles.remove(muteRole).catch(async (err: Error) => {
          (await guild.logging?.moderation)?.send({
            embeds: [
              new FailEmbed(
                `Fail to unmute \`${userId}\` - \`#${caseNum}\` with reason: ${err.name}`
              ),
            ],
          });
        });
        const data: ModlogData = {
          action: 'unmute',
          guild: guild,
          member: member,
          reason: 'Mute expired',
          staff: guild.members.me!,
        };

        const modlog = new Modlog(data);
        await modlog.create();
        continue;
      }
    }
  }
}
