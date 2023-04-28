// import { GirColors, GirEmojis } from '#constants';
import { GirColors, GirEmojis } from '#constants';
import {
  GirCommand,
  GirPaginatedMessageEmbedFields,
  InfoEmbed,
  Page,
} from '#lib/structures';
import warnSchema from '#lib/structures/schemas/warn-schema';
import { PermissionLevels } from '#lib/types';
import { ApplyOptions } from '@sapphire/decorators';
import { send } from '@sapphire/plugin-editable-commands';
import { EmbedBuilder } from 'discord.js';
// import { EmbedBuilder } from 'discord.js';

@ApplyOptions<GirCommand.Options>({
  description: 'A basic command',
  name: 'warnings',
  aliases: ['warns'],
  permissionLevel: PermissionLevels.Trainee,
  options: ['pageSize'],
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

    const page = new Page(
      warnSchema.find({
        userId: target.id,
        guildId: target.guild.id,
      })
    );

    if (page.length === 0) {
      return await send(message, {
        embeds: [new InfoEmbed('There are no warnings')],
      });
    }
    // const warnings = await page.getPage(pageNumber);
    const totalPages = Math.ceil(totalWarns / 10);

    let pages = [];
    for (let p = 1; p < totalPages + 1; p++) {
      const pg = new Page(
        warnSchema.find({
          userId: target.id,
          guildId: target.guild.id,
        })
      );
      const newPage = await pg.getPage(p);
      pages.push(newPage);
    }
    const pageEmbed = new GirPaginatedMessageEmbedFields();
    pages.forEach((page) => {
      const embed = new EmbedBuilder().setColor(GirColors.Default);

      if (totalWarns === 0) {
        embed.setDescription(`${GirEmojis.Info} There are no warnings.`);
      } else {
        embed
          .setAuthor({
            name: `${totalWarns} Warnings for ${target.user.tag} (${target.id})`,
            iconURL: target.displayAvatarURL({ forceStatic: true }),
          })
          .setFooter({
            text: ` Do ${this.container.client.fetchPrefix(
              message
            )}warnings [user] [page] to view the next page`,
          });
        page.forEach((warn: any) => {
          embed.addFields({
            name: `ID: ${warn._id} | Moderator: ${warn.staffTag}`,
            value: [
              `${warn.reason} - <t:${Math.floor(
                new Date(warn.createdAt).getTime() / 1000
              )}>`,
            ].join('\n'),
          });
        });
      }
      pageEmbed.addPageEmbed(embed);
    });
    pageEmbed.embedFooterSeparator = ' |';
    pageEmbed.pageIndexPrefix = 'Page';

    return await pageEmbed.run(message);
  }
}
