import { GirCommand } from '#lib/structures';
import automodSchema from '#lib/structures/schemas/automod-schema,';
import { ModActions } from '#lib/types';
import { capitalizeWords } from '#lib/utility';
import { ApplyOptions } from '@sapphire/decorators';
import { ms } from 'enhanced-ms';

@ApplyOptions<GirCommand.Options>({
  description: 'Update the automod settings of the server',
  name: 'automod',
  detailedDescription: {
    usage: '/automod',
    examples: ["/automod bannedwords add: 'loser'"],
  },
})
export class automodCommand extends GirCommand {
  public override async chatInputRun(
    interaction: GirCommand.ChatInputCommandInteraction
  ) {
    const subCommand = interaction.options.getSubcommand();
    switch (subCommand) {
      case 'bannedwords':
        const threshold = interaction.options.getNumber('threshold');
        const duration = interaction.options.getNumber('duration');
        const violations = interaction.options.getNumber('violations');
        const add = interaction.options.getString('add');
        const remove = interaction.options.getString('remove');
        const action = interaction.options.getString('action');

        await automodSchema.findOneAndUpdate(
          {
            _id: interaction.guildId,
          },
          {
            bannedWords: {
              enabled: true,
              violations: violations ?? 3,
              duration: duration ?? 300,
              threshold: threshold ?? 60,
              action: action ?? 'warn',
              bannedWords: [],
              ignoredChannels: [],
              ignoredRoles: [],
            },
          },
          {
            upsert: true,
            setDefaultsOnInsert: true,
          }
        );
        const data = await automodSchema.findOne({
          _id: interaction.guildId,
        });
        let automodData = data;
        if (!automodData) {
          automodData = await automodSchema.create({
            _id: interaction.guildId,
          });
        }
        let output: string = '';

        if (add) {
          await automodData?.updateOne(
            { $push: { 'bannedWords.bannedWords': add } },
            { upsert: true, setDefaultsOnInsert: true }
          );
          output += `\nAdded \`${add}\` to the list of banned words in the server`;
        }

        if (remove) {
          await automodData?.updateOne(
            { $pull: { 'bannedWords.bannedWords': remove } },
            { upsert: true, setDefaultsOnInsert: true }
          );
          output += `\nRemoved \`${remove}\` from the list of banned words in the server`;
        }

        if (threshold && duration && violations && action) {
          await automodData?.updateOne(
            {
              $set: {
                threshold: threshold,
                duration: duration,
                violations: violations,
                action: action,
              },
            },
            { upsert: true, setDefaultsOnInsert: true }
          );

          output += `\n\nA message will be counted as a violation if it has \`${threshold}%\` or more banned words`;
          output += `\nThe bot will \`${capitalizeWords(
            action
          )}\` when someone has \`${violations}\` or more vaiolation in the last \`${ms(
            duration * 1000
          )}\``;
        }

        await automodData?.save();

        interaction.reply(output);
        break;

      default:
        break;
    }
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
          ),

      { idHints: ['1105914871230500964'] }
    );
  }
}
