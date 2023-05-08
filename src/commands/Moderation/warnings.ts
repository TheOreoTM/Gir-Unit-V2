// import { GirColors, GirEmojis } from '#constants';
import { GirColors } from '#constants';
import {
  GirCommand,
  GirPaginatedMessageEmbedFields,
  InfoEmbed,
} from '#lib/structures';
import warnSchema from '#lib/structures/schemas/warn-schema';
import { PermissionLevels } from '#lib/types';
import { ApplyOptions } from '@sapphire/decorators';
import { send } from '@sapphire/plugin-editable-commands';
import { EmbedBuilder } from 'discord.js';

@ApplyOptions<GirCommand.Options>({
  description: 'A basic command',
  name: 'warnings',
  aliases: ['warns'],
  permissionLevel: PermissionLevels.Trainee,
})
export class warningsCommand extends GirCommand {
  public override async messageRun(
    message: GirCommand.Message,
    args: GirCommand.Args
  ) {
    const target = await args.pick('member').catch(() => message.member);
    const totalWarns = await warnSchema.countDocuments({
      userId: target.id,
      guildId: target.guild.id,
    });

    const warnings = await warnSchema
      .find({
        userId: target.id,
        guildId: target.guild.id,
      })
      .select(['_id', 'staffTag', 'reason', 'createdAt']);

    if (warnings.length === 0) {
      return await send(message, {
        embeds: [new InfoEmbed('There are no warnings')],
      });
    }

    const pageSize = 10;
    const totalPages = Math.ceil(warnings.length / pageSize);

    const pageEmbed = new GirPaginatedMessageEmbedFields();

    for (let p = 0; p < totalPages; p++) {
      const embed = new EmbedBuilder().setColor(GirColors.Default);

      embed
        .setAuthor({
          name: `${totalWarns} Warnings for ${target.user.tag} (${target.id})`,
          iconURL: target.displayAvatarURL({ forceStatic: true }),
        })
        .setFooter({
          text: ` Do ${await this.container.client.fetchPrefix(
            message
          )}warnings [user] [page] to view the next page`,
        });

      const start = p * pageSize;
      const page = warnings.slice(start, start + pageSize);

      for (const warn of page) {
        embed.addFields({
          name: `ID: ${warn._id} | Moderator: ${warn.staffTag}`,
          value: [
            `${warn.reason} - <t:${Math.floor(
              new Date(warn.createdAt).getTime() / 1000
            )}>`,
          ].join('\n'),
        });
      }

      pageEmbed.addPageEmbed(embed);
    }

    pageEmbed.embedFooterSeparator = ' |';
    pageEmbed.pageIndexPrefix = 'Page';

    return await pageEmbed.run(message);
  }
}
