import { GirEmojis } from '#constants';
import { GirCommand } from '#lib/structures';
import automodSchema from '#lib/structures/schemas/automod-schema,';
import {
  AutomodActions,
  AutomodDocument,
  DefaultAutomodData,
  ModActions,
} from '#lib/types';
import { capitalizeWords, days, hours, minutes } from '#lib/utility';
import { ApplyOptions } from '@sapphire/decorators';
import { EmbedBuilder } from 'discord.js';
import ms from 'enhanced-ms';
// import { ms } from 'enhanced-ms';

@ApplyOptions<GirCommand.Options>({
  description: 'Update the automod settings of the server',
  name: 'automod',
  detailedDescription: {
    usages: ['/automod'],
    examples: ["/automod bannedwords add: 'loser'"],
  },
})
export class automodCommand extends GirCommand {
  public override async chatInputRun(
    interaction: GirCommand.ChatInputCommandInteraction
  ) {
    const enabled = interaction.options.getBoolean('enabled');
    const threshold = interaction.options.getNumber('threshold');
    const duration = interaction.options.getNumber('duration');
    const violations = interaction.options.getNumber('violations');
    const action = interaction.options.getString('action');
    const shouldDelete = interaction.options.getBoolean('delete');
    const shouldAlert = interaction.options.getBoolean('alert');
    const punishment_duration = interaction.options.getString(
      'punishment_duration'
    );
    const shouldLog = interaction.options.getBoolean('log');

    const add = interaction.options.getString('add');
    const remove = interaction.options.getString('remove');

    const dataToSend: Partial<AutomodDocument['bannedWords']> = {};

    if (typeof enabled === 'boolean') dataToSend.enabled = enabled;
    if (threshold) dataToSend.threshold = threshold;
    if (duration) dataToSend.duration = duration * 1000;
    if (violations) dataToSend.violations = violations;
    if (action) dataToSend.action = action;
    if (punishment_duration)
      dataToSend.punishmentDuration = parseInt(punishment_duration);
    if (shouldDelete) dataToSend.shouldDelete = shouldDelete;
    if (shouldAlert) dataToSend.shouldAlert = shouldAlert;
    if (shouldLog) dataToSend.shouldLog = shouldLog;

    const subCommand = interaction.options.getSubcommand();

    const data = await automodSchema.findOneAndUpdate({
      _id: interaction.guildId,
    });

    let header = '';

    if (interaction.options.getString('action') === ModActions.Mute) {
      // Perform action for ModActions.Mute
    }

    switch (subCommand) {
      case 'bannedwords':
        console.log(dataToSend, enabled);
        header = 'Banned Words';
        const newData =
          data ||
          new automodSchema({
            _id: interaction.guildId,
            bannedWords: {
              ...DefaultAutomodData,
              bannedWords: new Map(),
            },
          });

        newData.bannedWords = {
          ...newData.bannedWords,
          ...dataToSend,
        };

        if (add) {
          const wildCard = add.endsWith('!*');
          const wordToAdd = add.replaceAll('!*', '');

          newData.bannedWords.bannedWords.set(wordToAdd, wildCard);
        }

        if (remove) {
          newData.bannedWords.bannedWords.delete(remove);
        }

        await newData.save();
        const automodData = await automodSchema.findOne({
          _id: interaction.guildId,
        });

        const embed = this.buildEmbed(header, automodData?.bannedWords, {
          add: add,
          remove: remove,
        });

        return await interaction.reply({ embeds: [embed] });

      default:
        break;
    }

    return;
  }

  public override registerApplicationCommands(registry: GirCommand.Registry) {
    registry.registerChatInputCommand(
      (builder) =>
        builder //
          .setName(this.name)
          .setDescription(this.description)
          // Banned words
          .addSubcommand((option) =>
            option
              .setName('bannedwords')
              .setDescription('Update the banned words rule for the server')
              .addBooleanOption((option) =>
                option
                  .setName('enabled')
                  .setDescription(
                    'Whether the bannedwords rule is enabled or not'
                  )
              )
              .addStringOption((option) =>
                option
                  .setName('add')
                  .setDescription(
                    'Add a new banned word to the banned words list'
                  )
              )
              .addStringOption((option) =>
                option
                  .setName('remove')
                  .setDescription(
                    'Remove a banned word from the banned words list'
                  )
                  .setAutocomplete(true)
              )
              .addNumberOption((option) =>
                option
                  .setName('violations')
                  .setDescription(
                    'The number of violations in the specified duration that should occur for the bot to take action'
                  )
                  .setMaxValue(10)
                  .setMinValue(1)
              )
              .addNumberOption((option) =>
                option
                  .setName('duration')
                  .setDescription('The duration between violations in seconds')
                  .setMaxValue(300)
                  .setMinValue(10)
              )
              .addNumberOption((option) =>
                option
                  .setName('threshold')
                  .setDescription(
                    'The amount of banned words in a message to be considered a violation as a percentage'
                  )
                  .setMaxValue(100)
                  .setMinValue(1)
              )
              .addStringOption((option) =>
                option
                  .setName('action')
                  .setDescription(
                    'The action that the bot should take (default: warn)'
                  )
                  .addChoices(
                    { name: 'Ban', value: ModActions.Ban },
                    { name: 'Mute', value: ModActions.Mute },
                    { name: 'Kick', value: ModActions.Kick },
                    { name: 'Warn', value: ModActions.Warn }
                  )
              )
              .addStringOption((option) =>
                option
                  .setName('punishment_duration')
                  .setDescription(
                    'How long the bot should punish for (if the action is mute/ban)'
                  )
                  .setChoices(
                    { name: 'Permanent', value: `-1` },
                    { name: '1 minute', value: `${minutes(1)}` },
                    { name: '5 minutes', value: `${minutes(5)}` },
                    { name: '10 minutes', value: `${minutes(10)}` },
                    { name: '20 minutes', value: `${minutes(20)}` },
                    { name: '30 minutes', value: `${minutes(30)}` },
                    { name: '1 hour', value: `${hours(1)}` },
                    { name: '2 hours', value: `${hours(2)}` },
                    { name: '4 hours', value: `${hours(4)}` },
                    { name: '8 hours', value: `${hours(8)}` },
                    { name: '12 hours', value: `${hours(12)}` },
                    { name: '1 day', value: `${days(1)}` }
                  )
              )
              .addBooleanOption((option) =>
                option.setDescription('Delete the message?').setName('delete')
              )
              .addBooleanOption((option) =>
                option.setDescription('Alert the user?').setName('alert')
              )
              .addBooleanOption((option) =>
                option
                  .setDescription('Send a log to the logging channel?')
                  .setName('log')
              )
          ),

      { idHints: ['1105914871230500964'] }
    );
  }

  private buildEmbed(
    header: string,
    data: any,
    {
      add,
      remove,
    }: {
      add?: string | null;
      remove?: string | null;
    }
  ): EmbedBuilder {
    const {
      duration,
      violations,
      action,
      punishmentDuration,
      bannedWords,
      shouldAlert,
      shouldDelete,
      shouldLog,
      enabled: isEnabled,
    } = data;
    const embed = new EmbedBuilder().setTitle(header);
    if (duration && violations && action) {
      embed.setDescription(
        `\`${capitalizeWords(
          action
        )}\` when someone has \`${violations} violations\` or more in the last \`${ms(
          duration
        )}\``
      );
    } else {
      duration
        ? embed.addFields({
            name: 'Duration between violations',
            value: `\`${ms(duration) || 'None'}\``,
          })
        : embed;
      violations
        ? embed.addFields({
            name: 'Minimum violations before action',
            value: `\`${violations || '-1'} violations\``,
          })
        : embed;
      action
        ? embed.addFields({
            name: 'Action to take',
            value: `\`${action || 'None'}\``,
          })
        : embed;
    }

    if (
      (action === AutomodActions.Mute || action === AutomodActions.Ban) &&
      punishmentDuration !== -1
    ) {
      embed.setDescription(
        `\`${capitalizeWords(action)}\` for \`${ms(
          punishmentDuration
        )}\` when someone has \`${violations} violations\` or more in the last \`${ms(
          duration
        )}\``
      );
    } else if (punishmentDuration) {
      punishmentDuration === -1
        ? embed.addFields({
            name: 'Punishment Duration',
            value: `\`Permanent\``,
          })
        : embed.addFields({
            name: 'Punishment Duration',
            value: `\`${ms(punishmentDuration)}\` ${
              action === AutomodActions.Kick || action === AutomodActions.Warn
                ? `\n*Note: This setting has no affect since the action type is set to \`${action}\`*`
                : ''
            }`,
          });
    }

    add
      ? embed.addFields({
          name: `Banned Word Added (${add})`,
          value: `New list: ||${
            Array.from(bannedWords.keys()).join(', ').replaceAll('||', '||') ??
            'None'
          }||`,
        })
      : embed;

    remove
      ? embed.addFields({
          name: `Banned Word Removed (${remove})`,
          value: `New list: ||${
            Array.from(bannedWords.keys()).join(', ').replaceAll('||', '||') ??
            'None'
          }||`,
        })
      : embed;

    if (shouldDelete)
      embed.addFields({
        name: 'Delete message?',
        value: shouldDelete ? GirEmojis.Success : GirEmojis.Fail,
        inline: true,
      });

    if (shouldLog)
      embed.addFields({
        name: 'Send log message?',
        value: shouldLog ? GirEmojis.Success : GirEmojis.Fail,
        inline: true,
      });

    if (shouldAlert)
      embed.addFields({
        name: 'Alert user?',
        value: shouldAlert ? GirEmojis.Success : GirEmojis.Fail,
        inline: true,
      });

    embed.addFields({
      name: 'Status',
      value: `${isEnabled ? '` Enabled 🟢 `' : '` Disabled 🔴 `'}`,
    });

    return embed;
  }
}
