import { GirColors } from '#constants';
import staffRolesSchema from '#lib/structures/schemas/staffRoles-schema';
import { ApplyOptions } from '@sapphire/decorators';
import {
  InteractionHandler,
  InteractionHandlerTypes,
} from '@sapphire/framework';
import {
  ActionRowBuilder,
  ButtonInteraction,
  ComponentType,
  EmbedBuilder,
  RoleSelectMenuBuilder,
} from 'discord.js';

@ApplyOptions<InteractionHandler.Options>({
  interactionHandlerType: InteractionHandlerTypes.Button,
})
export class ButtonHandler extends InteractionHandler {
  public async run(interaction: ButtonInteraction) {
    const { customId } = interaction;
    switch (customId.replace('setup_', '')) {
      case 'start':
        await this.traineeRoles(interaction);
        break;
      case 'continue_from_trainee': //  to staff
        await this.staffRoles(interaction);
        break;
      case 'continue_from_staff': // to mod
        await this.modRoles(interaction);
        break;
      case 'continue_from_mod': // to admin
        await this.adminRoles(interaction);
        break;
      case 'continue_from_admin': // to end
        await this.end(interaction);
        break;
      default:
        break;
    }
  }

  // Trainee roles settings - Step 1
  private async traineeRoles(interaction: ButtonInteraction) {
    const data = await staffRolesSchema
      .findOne({ _id: interaction.guildId })
      .select(['trainee']);
    let staffRoles: string[];
    if (!data) {
      staffRoles = ['`None`'];
    } else {
      if (data.trainee.length > 0) {
        staffRoles = data.trainee;
      } else staffRoles = ['`None`'];
    }

    const trainees = staffRoles.map((role) => {
      if (role === '`None`') return role;
      return `<@&${role}>`;
    });
    const roleSelectmenu = new RoleSelectMenuBuilder()
      .setCustomId('setup_trainee')
      .setMinValues(1)
      .setMaxValues(5)
      .setPlaceholder('Select trainee role(s)');

    const traineeRoleSelectEmbed = new EmbedBuilder()
      .setColor(GirColors.Default)
      .setTitle('Trainee Role Select')
      .setDescription(
        [
          'Select the servers trainee roles',
          'This role will have limited permissions compared to other staff roles. Such as not being able to ban or kick.',
        ].join('\n')
      )
      .addFields({
        name: 'Trainee Roles',
        value: `${trainees.join(', ')}`,
      });

    await interaction.update({
      embeds: [traineeRoleSelectEmbed],
      components: [
        new ActionRowBuilder<RoleSelectMenuBuilder>().addComponents(
          roleSelectmenu
        ),
      ],
    });
  }

  // Staff roles settings - Step 2
  private async staffRoles(interaction: ButtonInteraction) {
    const data = await staffRolesSchema
      .findOne({ _id: interaction.guildId })
      .select(['staff']);
    let staffRoles: string[];
    if (!data) {
      staffRoles = ['`None`'];
    } else {
      if (data.staff.length > 0) {
        staffRoles = data.staff;
      } else staffRoles = ['`None`'];
    }

    const staffs = staffRoles.map((role) => {
      if (role === '`None`') return role;
      return `<@&${role}>`;
    });

    const roleSelectmenu = new RoleSelectMenuBuilder()
      .setCustomId('setup_staff')
      .setMinValues(1)
      .setMaxValues(5)
      .setPlaceholder('Select staff role(s)');

    const staffRoleSelectEmbed = new EmbedBuilder()
      .setColor(GirColors.Default)
      .setTitle('Staff Role Select')
      .setDescription(['Select the servers staff roles'].join('\n'))
      .addFields({
        name: 'Staff Roles',
        value: `${staffs.join(', ')}`,
      });

    await interaction.update({
      embeds: [staffRoleSelectEmbed],
      components: [
        new ActionRowBuilder<RoleSelectMenuBuilder>().addComponents(
          roleSelectmenu
        ),
      ],
    });
  }

  // Mod roles setup - Step 3
  private async modRoles(interaction: ButtonInteraction) {
    const data = await staffRolesSchema
      .findOne({ _id: interaction.guildId })
      .select(['moderator']);
    let modRoles: string[];
    if (!data) {
      modRoles = ['`None`'];
    } else {
      if (data.moderator.length > 0) {
        modRoles = data.moderator;
      } else modRoles = ['`None`'];
    }

    const mods = modRoles.map((role) => {
      if (role === '`None`') return role;
      return `<@&${role}>`;
    });
    const roleSelectmenu = new RoleSelectMenuBuilder()
      .setCustomId('setup_mod')
      .setMinValues(1)
      .setMaxValues(5)
      .setPlaceholder('Select moderator role(s)');

    const modRoleSelectEmbed = new EmbedBuilder()
      .setColor(GirColors.Default)
      .setTitle('Moderator Role Select')
      .setDescription(['Select the servers moderator roles'].join('\n'))
      .addFields({
        name: 'Mod Roles',
        value: `${mods.join(', ')}`,
      });

    await interaction.update({
      embeds: [modRoleSelectEmbed],
      components: [
        new ActionRowBuilder<RoleSelectMenuBuilder>().addComponents(
          roleSelectmenu
        ),
      ],
    });
  }

  // Adminroles setup - Step 4
  private async adminRoles(interaction: ButtonInteraction) {
    const data = await staffRolesSchema
      .findOne({ _id: interaction.guildId })
      .select(['admin']);
    let adminRoles: string[];
    if (!data) {
      adminRoles = ['`None`'];
    } else {
      if (data.admin.length > 0) {
        adminRoles = data.admin;
      } else adminRoles = ['`None`'];
    }

    const admins = adminRoles.map((role) => {
      if (role === '`None`') return role;
      return `<@&${role}>`;
    });
    const roleSelectmenu = new RoleSelectMenuBuilder()
      .setCustomId('setup_admin')
      .setMinValues(1)
      .setMaxValues(5)
      .setPlaceholder('Select admin role(s)');

    const adminRoleSelectEmbed = new EmbedBuilder()
      .setColor(GirColors.Default)
      .setTitle('Admin Role Select')
      .setDescription(['Select the servers admin roles'].join('\n'))
      .addFields({
        name: 'Admin Roles',
        value: `${admins.join(', ')}`,
      });

    await interaction.update({
      embeds: [adminRoleSelectEmbed],
      components: [
        new ActionRowBuilder<RoleSelectMenuBuilder>().addComponents(
          roleSelectmenu
        ),
      ],
    });
  }

  private async end(interaction: ButtonInteraction) {
    await interaction.update({
      content: '🚧 Too lazy to make the rest ',
      embeds: [],
      components: [],
    });
  }

  public override parse(interaction: ButtonInteraction) {
    if (interaction.componentType !== ComponentType.Button) return this.none();
    if (!interaction.customId.startsWith('setup_')) return this.none();

    return this.some();
  }
}
