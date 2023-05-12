// import { GirEmojis } from '#constants';
import { GirColors, GirEmojis } from '#constants';
import loggingSchema from '#lib/structures/schemas/logging-schema';
import { ApplyOptions } from '@sapphire/decorators';
import {
  InteractionHandler,
  InteractionHandlerTypes,
} from '@sapphire/framework';
import {
  // ActionRowBuilder,
  // ButtonBuilder,
  // ButtonStyle,
  ChannelSelectMenuInteraction,
  ComponentType,
  EmbedBuilder,
  TextChannel,
  Webhook,
} from 'discord.js';

@ApplyOptions<InteractionHandler.Options>({
  interactionHandlerType: InteractionHandlerTypes.SelectMenu,
})
export class MenuHandler extends InteractionHandler {
  public override async run(interaction: ChannelSelectMenuInteraction) {
    const { customId } = interaction;
    const id = customId.replace('setup_', '');

    switch (id) {
      case 'modlog':
        await this.modlog(interaction);
        break;
      case 'message':
        await this.message(interaction);
        break;
      case 'member':
        await this.member(interaction);
        break;
      case 'server':
        await this.server(interaction);
        break;
      case 'channel':
        await this.channel(interaction);
        break;
      case 'role':
        await this.role(interaction);
        break;
    }
  }

  private async modlog(interaction: ChannelSelectMenuInteraction) {
    const { message, guildId, values } = interaction;
    const moderationChannel = values[0];

    const receivedEmbed = message.embeds[0];

    const embed = EmbedBuilder.from(receivedEmbed).setFields({
      name: 'Modlog Channel',
      value: `<#${moderationChannel}>`,
    });

    await interaction.update({
      embeds: [embed],
      components: [...message.components],
    });

    const webhook = await this.createWebhook(interaction);
    await this.setup(webhook, 'modlog');
    await loggingSchema.findOneAndUpdate(
      { _id: guildId },
      {
        moderation: {
          id: moderationChannel,
          url: webhook.url,
        },
      },
      { upsert: true, setDefaultsOnInsert: true }
    );
  }

  private async message(interaction: ChannelSelectMenuInteraction) {
    const { message, guildId, values } = interaction;
    const messageLoggingChannel = values[0];

    const receivedEmbed = message.embeds[0];

    const embed = EmbedBuilder.from(receivedEmbed).setFields({
      name: 'Message logging Channel',
      value: `<#${messageLoggingChannel}>`,
    });

    await interaction.update({
      embeds: [embed],
      components: [...message.components],
    });
    const webhook = await this.createWebhook(interaction);

    await loggingSchema.findOneAndUpdate(
      { _id: guildId },
      {
        message: {
          id: messageLoggingChannel,
          url: webhook.url,
        },
      },
      { upsert: true }
    );
  }

  private async member(interaction: ChannelSelectMenuInteraction) {
    const { message, guildId, values } = interaction;
    const memberLoggingChannel = values[0];
    const receivedEmbed = message.embeds[0];

    const embed = EmbedBuilder.from(receivedEmbed).setFields({
      name: 'Member logging Channel',
      value: `<#${memberLoggingChannel}>`,
    });

    await interaction.update({
      embeds: [embed],
      components: [...message.components],
    });
    const webhook = await this.createWebhook(interaction);

    await loggingSchema.findOneAndUpdate(
      { _id: guildId },
      {
        member: {
          id: memberLoggingChannel,
          url: webhook.url,
        },
      },
      { upsert: true }
    );
  }

  private async server(interaction: ChannelSelectMenuInteraction) {
    const { message, guildId, values } = interaction;
    const serverLoggingChannel = values[0];
    const receivedEmbed = message.embeds[0];

    const embed = EmbedBuilder.from(receivedEmbed).setFields({
      name: 'Server logging Channel',
      value: `<#${serverLoggingChannel}>`,
    });

    await interaction.update({
      embeds: [embed],
      components: [...message.components],
    });
    const webhook = await this.createWebhook(interaction);

    await loggingSchema.findOneAndUpdate(
      { _id: guildId },
      {
        server: {
          id: serverLoggingChannel,
          url: webhook.url,
        },
      },
      { upsert: true }
    );
  }

  private async channel(interaction: ChannelSelectMenuInteraction) {
    const { message, guildId, values } = interaction;
    const channelLoggingChannel = values[0];
    const receivedEmbed = message.embeds[0];

    const embed = EmbedBuilder.from(receivedEmbed).setFields({
      name: 'Channel logging Channel',
      value: `<#${channelLoggingChannel}>`,
    });

    await interaction.update({
      embeds: [embed],
      components: [...message.components],
    });
    const webhook = await this.createWebhook(interaction);

    await loggingSchema.findOneAndUpdate(
      { _id: guildId },
      {
        channel: {
          id: channelLoggingChannel,
          url: webhook.url,
        },
      },
      { upsert: true }
    );
  }

  private async role(interaction: ChannelSelectMenuInteraction) {
    const { message, guildId, values } = interaction;
    const roleLoggingChannel = values[0];
    const receivedEmbed = message.embeds[0];

    const embed = EmbedBuilder.from(receivedEmbed).setFields({
      name: 'Role logging Channel',
      value: `<#${roleLoggingChannel}>`,
    });

    await interaction.update({
      embeds: [embed],
      components: [...message.components],
    });
    const webhook = await this.createWebhook(interaction);

    await loggingSchema.findOneAndUpdate(
      { _id: guildId },
      {
        role: {
          id: roleLoggingChannel,
          url: webhook.url,
        },
      },
      { upsert: true }
    );
  }

  private async createWebhook(
    interaction: ChannelSelectMenuInteraction
  ): Promise<Webhook> {
    const channel = interaction.guild?.channels.cache.get(
      interaction.values[0]
    ) as TextChannel;

    return await channel.createWebhook({
      name: 'Gir-Unit',
      avatar:
        'https://cdn.discordapp.com/attachments/1095696384348410007/1105191621525508146/gir-unit-avatar.png',
    });
  }

  private async setup(webhook: Webhook, channelName: string) {
    const embed = new EmbedBuilder()
      .setDescription(
        `${GirEmojis.Success} This channel has been successfully set as the **${channelName} logging channel**`
      )
      .setColor(GirColors.Success);
    return await webhook.send({ embeds: [embed] });
  }

  public override parse(interaction: ChannelSelectMenuInteraction) {
    if (interaction.componentType !== ComponentType.ChannelSelect)
      return this.none();

    if (!interaction.customId.startsWith('setup_')) return this.none();

    return this.some();
  }
}
