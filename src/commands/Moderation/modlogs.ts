// import { GirColors, GirEmojis } from '#constants';
import { GirColors } from '#constants';
import {
  GirCommand,
  GirPaginatedMessageEmbedFields,
  InfoEmbed,
  Timestamp,
} from '#lib/structures';
import modlogsSchema from '#lib/structures/schemas/modlogs-schema';
import { PermissionLevels } from '#lib/types';
import { ApplyOptions } from '@sapphire/decorators';
import { send } from '@sapphire/plugin-editable-commands';
import { EmbedBuilder } from 'discord.js';

@ApplyOptions<GirCommand.Options>({
  description: 'View a list of moderation logs for a user',
  name: 'modlogs',
  permissionLevel: PermissionLevels.Trainee,
  detailedDescription: {
    examples: ['modlogs', 'modlogs @Oreo'],
    usage: 'modlogs [user?]',
  },
})
export class warningsCommand extends GirCommand {
  public override async messageRun(
    message: GirCommand.Message,
    args: GirCommand.Args
  ) {
    const target = await args.pick('member').catch(() => message.member);
    const totalModlogs = await modlogsSchema.countDocuments({
      userId: target.id,
      guildId: target.guild.id,
    });

    const modlogs = await modlogsSchema.find({
      userId: target.id,
      guildId: target.guild.id,
    });

    if (totalModlogs === 0) {
      return await send(message, {
        embeds: [new InfoEmbed('There are no modlogs')],
      });
    }

    const pageSize = 10;
    const totalPages = Math.ceil(totalModlogs / pageSize);

    const pageEmbed = new GirPaginatedMessageEmbedFields();

    for (let p = 0; p < totalPages; p++) {
      const embed = new EmbedBuilder().setColor(GirColors.Default);

      embed.setAuthor({
        name: `${totalModlogs} Modlogs for ${target.user.username} (${target.id})`,
        iconURL: target.displayAvatarURL({ forceStatic: true }),
      });

      const start = p * pageSize;
      const page = modlogs.slice(start, start + pageSize);

      for (const log of page) {
        const timestamp = new Timestamp(new Date(log.createdAt).getTime());
        embed.addFields({
          name: `Case ${log.caseNum}`,
          value: [
            `**Type:** ${log.action}`,
            `**User:** <@${log.userId}> (${log.userName})`,
            `**Moderator:** <@${log.staffId}> (${log.staffName})`,
            `**Reason:** ${log.reason} - ${timestamp.getRelativeTime()}`,
          ].join('\n'),
        });
      }

      pageEmbed.addPageEmbed(embed);
    }

    pageEmbed.embedFooterSeparator = ' • ';
    pageEmbed.pageIndexPrefix = 'Page';

    return await pageEmbed.run(message);
  }
}
