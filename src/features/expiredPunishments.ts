import { FailEmbed, Modlog, Task } from '#lib/structures';
import punishmentSchema from '#lib/structures/schemas/punishment-schema';
import { ModlogData, PunishmentType } from '#lib/types';

import { Cron } from 'croner';

export class ExpiredWarnTask extends Task {
  public pattern: string = '*/5 * * * * *';

  constructor() {
    super();
    this.cron = Cron(this.pattern, () => {
      this.run();
    });
  }

  public async stop(): Promise<void> {
    this.cron.stop();
  }

  public async run(): Promise<void> {
    const now = new Date();
    const query = {
      expires: { $lt: now },
    };
    const punishments = await punishmentSchema.find(query);
    await punishmentSchema.deleteMany(query);

    if (!punishments.length) return;

    for (const punishment of punishments) {
      const { guildId, userId, type, caseNum } = punishment;
      const guild = this.client.guilds.cache.get(guildId);
      if (!guild) continue;

      if (type === PunishmentType.Mute) {
        const member = guild.members.cache.get(userId);
        if (!member) continue;
        const muteRole = await guild.settings?.moderation.MuteRole;
        if (!muteRole) {
          const moderationLog = await guild.logging?.moderation;
          if (!moderationLog) continue;

          const warningEmbed = new FailEmbed(
            `Failed to unmute \`${userId}\` - \`#${caseNum}\` with reason: No mute role found`
          );
          await moderationLog.send({ embeds: [warningEmbed] });
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
