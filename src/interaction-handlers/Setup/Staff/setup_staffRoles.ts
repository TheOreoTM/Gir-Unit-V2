import { GirEmojis } from '#constants';
import staffRolesSchema from '#lib/structures/schemas/staffRoles-schema';
import { ApplyOptions } from '@sapphire/decorators';
import {
  InteractionHandler,
  InteractionHandlerTypes,
} from '@sapphire/framework';
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
  EmbedBuilder,
  RoleSelectMenuBuilder,
  RoleSelectMenuInteraction,
} from 'discord.js';

@ApplyOptions<InteractionHandler.Options>({
  interactionHandlerType: InteractionHandlerTypes.SelectMenu,
})
export class MenuHandler extends InteractionHandler {
  public override async run(interaction: RoleSelectMenuInteraction) {
    const { customId } = interaction;
    const id = customId.replace('setup_', '');
    const continueButton = new ButtonBuilder()
      .setCustomId(`setup_continue_from_${id}`)
      .setLabel('Continue')
      .setEmoji(GirEmojis.Right)
      .setStyle(ButtonStyle.Success);
    switch (id) {
      case 'trainee': // Step 1
        await interaction.update({
          embeds: [await this.traineeRoles(interaction)],
          components: [
            new ActionRowBuilder<RoleSelectMenuBuilder>().addComponents(
              new RoleSelectMenuBuilder()
                .setCustomId('setup_trainee')
                .setMinValues(1)
                .setMaxValues(5)
                .setPlaceholder('Select trainee role(s)')
            ),
            new ActionRowBuilder<ButtonBuilder>().addComponents(continueButton),
          ],
        });
        break;
      case 'staff': // Step 2
        await interaction.update({
          embeds: [await this.staffRoles(interaction)],
          components: [
            new ActionRowBuilder<RoleSelectMenuBuilder>().addComponents(
              new RoleSelectMenuBuilder()
                .setCustomId('setup_staff')
                .setMinValues(1)
                .setMaxValues(5)
                .setPlaceholder('Select staff role(s)')
            ),
            new ActionRowBuilder<ButtonBuilder>().addComponents(continueButton),
          ],
        });
        break;
      case 'mod': // Step 3
        await interaction.update({
          embeds: [await this.modRoles(interaction)],
          components: [
            new ActionRowBuilder<RoleSelectMenuBuilder>().addComponents(
              new RoleSelectMenuBuilder()
                .setCustomId('setup_mod')
                .setMinValues(1)
                .setMaxValues(5)
                .setPlaceholder('Select mod role(s)')
            ),
            new ActionRowBuilder<ButtonBuilder>().addComponents(continueButton),
          ],
        });
        break;
      case 'admin': // Step 3
        await interaction.update({
          embeds: [await this.adminRoles(interaction)],
          components: [
            new ActionRowBuilder<RoleSelectMenuBuilder>().addComponents(
              new RoleSelectMenuBuilder()
                .setCustomId('setup_admin')
                .setMinValues(1)
                .setMaxValues(5)
                .setPlaceholder('Select admin role(s)')
            ),
            new ActionRowBuilder<ButtonBuilder>().addComponents(continueButton),
          ],
        });
        break;

      default:
        break;
    }
  }

  private async traineeRoles(
    interaction: RoleSelectMenuInteraction
  ): Promise<EmbedBuilder> {
    const { values: roles, guild, message } = interaction;
    const embeds = message.embeds;
    await staffRolesSchema.findOneAndUpdate(
      { _id: guild!.id },
      {
        trainee: roles,
      },
      { upsert: true }
    );
    const receivedEmbed = embeds[0];
    const trainees = roles.map((role) => {
      if (role === '`None`') return role;
      return `<@&${role}>`;
    });

    const embed = EmbedBuilder.from(receivedEmbed).setFields({
      name: 'Trainee Roles',
      value: `${trainees.join(', ')}`,
    });

    return embed;
  }

  private async staffRoles(
    interaction: RoleSelectMenuInteraction
  ): Promise<EmbedBuilder> {
    const { values: roles, guild, message } = interaction;
    const embeds = message.embeds;
    await staffRolesSchema.findOneAndUpdate(
      { _id: guild!.id },
      {
        staff: roles,
      },
      { upsert: true }
    );
    const receivedEmbed = embeds[0];
    const staffs = roles.map((role) => {
      if (role === '`None`') return role;
      return `<@&${role}>`;
    });

    const embed = EmbedBuilder.from(receivedEmbed).setFields({
      name: 'Staff Roles',
      value: `${staffs.join(', ')}`,
    });

    return embed;
  }

  private async modRoles(
    interaction: RoleSelectMenuInteraction
  ): Promise<EmbedBuilder> {
    const { values: roles, guild, message } = interaction;
    const embeds = message.embeds;
    await staffRolesSchema.findOneAndUpdate(
      { _id: guild!.id },
      {
        moderator: roles,
      },
      { upsert: true }
    );
    const receivedEmbed = embeds[0];
    const mods = roles.map((role) => {
      if (role === '`None`') return role;
      return `<@&${role}>`;
    });

    const embed = EmbedBuilder.from(receivedEmbed).setFields({
      name: 'Moderator Roles',
      value: `${mods.join(', ')}`,
    });

    return embed;
  }

  private async adminRoles(
    interaction: RoleSelectMenuInteraction
  ): Promise<EmbedBuilder> {
    const { values: roles, guild, message } = interaction;
    const embeds = message.embeds;
    await staffRolesSchema.findOneAndUpdate(
      { _id: guild!.id },
      {
        admin: roles,
      },
      { upsert: true }
    );
    const receivedEmbed = embeds[0];
    const admins = roles.map((role) => {
      if (role === '`None`') return role;
      return `<@&${role}>`;
    });

    const embed = EmbedBuilder.from(receivedEmbed).setFields({
      name: 'Moderator Roles',
      value: `${admins.join(', ')}`,
    });

    return embed;
  }

  public override parse(interaction: RoleSelectMenuInteraction) {
    if (interaction.componentType !== ComponentType.RoleSelect)
      return this.none();

    if (!interaction.customId.startsWith('setup_')) return this.none();
    return this.some();
  }
}
