import { GirCommand } from '#lib/structures';
import automodSchema from '#lib/structures/schemas/automod-schema,';
import { ModActions } from '#lib/types';
import { days, hours, mins } from '#lib/utility';
import { ApplyOptions } from '@sapphire/decorators';
// import { ms } from 'enhanced-ms';

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

    // const threshold = interaction.options.getNumber('threshold');
    // const duration = interaction.options.getNumber('duration');
    // const violations = interaction.options.getNumber('violations');
    // const add = interaction.options.getString('add');
    // const remove = interaction.options.getString('remove');
    // const action = interaction.options.getString('action');
    const data = await automodSchema.findOne({ _id: interaction.guildId });

    if (interaction.options.getString('action') === ModActions.Mute) {
    }
    switch (subCommand) {
      case 'bannedwords':
        if (!data || !data?.bannedWords) {
          await automodSchema.findOneAndUpdate(
            { _id: interaction.guildId },
            { _id: interaction.guildId },
            { setDefaultsOnInsert: true }
          );
        }

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
              .addStringOption((option) =>
                option
                  .setName('punishment_duration')
                  .setDescription(
                    'How long the bot should punish for (if the action is mute/ban)'
                  )
                  .setChoices(
                    { name: 'Permanent', value: `0` },
                    { name: '1 minute', value: `${mins(1)}` },
                    { name: '5 minutes', value: `${mins(5)}` },
                    { name: '10 minutes', value: `${mins(10)}` },
                    { name: '20 minutes', value: `${mins(20)}` },
                    { name: '30 minutes', value: `${mins(30)}` },
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
}
