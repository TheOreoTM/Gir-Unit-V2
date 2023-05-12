import { GirColors, GirEmojis } from '#constants';
import { GirCommand } from '#lib/structures';
import { ApplyOptions } from '@sapphire/decorators';
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  PermissionFlagsBits,
} from 'discord.js';

@ApplyOptions<GirCommand.Options>({
  description: 'Easy and interactive setup for Gir-Unit',
  name: 'setup',
  requiredClientPermissions: ['ManageWebhooks'],
  detailedDescription: {
    usage: '/setup',
    examples: ['/setup'],
  },
})
export class setupCommand extends GirCommand {
  public override async chatInputRun(
    interaction: GirCommand.ChatInputCommandInteraction
  ) {
    await this.step0(interaction);
  }

  // Welcome to the setup
  private async step0(i: GirCommand.ChatInputCommandInteraction) {
    const startButton = new ButtonBuilder()
      .setLabel('Start')
      .setStyle(ButtonStyle.Success)
      .setEmoji(GirEmojis.Right)
      .setCustomId('setup_start');

    const cancelButton = new ButtonBuilder()
      .setLabel('Cancel')
      .setStyle(ButtonStyle.Danger)
      .setEmoji(GirEmojis.Stop)
      .setCustomId('setup_cancel');

    const welcomeEmbed = new EmbedBuilder()
      .setTitle('Welcome to Gir-Unit')
      .setDescription(
        'This is the setup wizard for Gir-Unit.\nThis will guide you through the process of setting up Gir-Unit.'
      )
      .setColor(GirColors.Default);

    await i.reply({
      ephemeral: true,
      embeds: [welcomeEmbed],
      components: [
        new ActionRowBuilder<ButtonBuilder>().addComponents(
          startButton,
          cancelButton
        ),
      ],
    });
  }

  // Rest of the logic inside interaction-handlers

  public override registerApplicationCommands(registry: GirCommand.Registry) {
    registry.registerChatInputCommand(
      (builder) =>
        builder //
          .setName(this.name)
          .setDescription(this.description)
          .setDMPermission(false)
          .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
      { idHints: ['1096169897463140493'] }
    );
  }
}
