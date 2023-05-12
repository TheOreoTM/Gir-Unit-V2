import { GirAvatar, GirColors, GirEmojis, GirUsername } from '#constants';
import loggingSchema from '#lib/structures/schemas/logging-schema';
import staffRolesSchema from '#lib/structures/schemas/staffRoles-schema';
import { ApplyOptions } from '@sapphire/decorators';
import {
  InteractionHandler,
  InteractionHandlerTypes,
} from '@sapphire/framework';
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  ChannelSelectMenuBuilder,
  ChannelType,
  ComponentType,
  EmbedBuilder,
  RoleSelectMenuBuilder,
  WebhookClient,
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
      case 'continue_from_admin': // to modlog channel
        await this.modlogChannel(interaction);
        break;
      case 'continue_from_modlog': // to message channel
        await this.messageChannel(interaction);
        break;
      case 'continue_from_message': // to member channel
        await this.memberChannel(interaction);
        break;
      case 'continue_from_member': // to server channel
        await this.serverChannel(interaction);
        break;
      case 'continue_from_server': // to channel channel
        await this.channelChannel(interaction);
        break;
      case 'continue_from_channel': // to role channel
        await this.roleChannel(interaction);
        break;
      case 'continue_from_role': // to end
        await this.end(interaction);
        break;
      default:
        break;
    }
  }

  // Trainee roles settings - Step 1
  private async traineeRoles(interaction: ButtonInteraction) {
    const continueButton = new ButtonBuilder()
      .setCustomId(`setup_continue_from_trainee`)
      .setLabel('Continue')
      .setEmoji(GirEmojis.Right)
      .setStyle(ButtonStyle.Success);
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
        new ActionRowBuilder<ButtonBuilder>().addComponents(continueButton),
      ],
    });
  }

  // Staff roles settings - Step 2
  private async staffRoles(interaction: ButtonInteraction) {
    const continueButton = new ButtonBuilder()
      .setCustomId(`setup_continue_from_staff`)
      .setLabel('Continue')
      .setEmoji(GirEmojis.Right)
      .setStyle(ButtonStyle.Success);
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
        new ActionRowBuilder<ButtonBuilder>().addComponents(continueButton),
      ],
    });
  }

  // Mod roles setup - Step 3
  private async modRoles(interaction: ButtonInteraction) {
    const continueButton = new ButtonBuilder()
      .setCustomId(`setup_continue_from_mod`)
      .setLabel('Continue')
      .setEmoji(GirEmojis.Right)
      .setStyle(ButtonStyle.Success);
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
        new ActionRowBuilder<ButtonBuilder>().addComponents(continueButton),
      ],
    });
  }

  // Admin roles setup - Step 4
  private async adminRoles(interaction: ButtonInteraction) {
    const continueButton = new ButtonBuilder()
      .setCustomId(`setup_continue_from_admin`)
      .setLabel('Continue')
      .setEmoji(GirEmojis.Right)
      .setStyle(ButtonStyle.Success);
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
        new ActionRowBuilder<ButtonBuilder>().addComponents(continueButton),
      ],
    });
  }

  // Modlog channel setup - Step 4
  private async modlogChannel(interaction: ButtonInteraction) {
    const data = await loggingSchema
      .findOne({ _id: interaction.guildId })
      .select(['moderation']);

    let modlogChannel: string;
    if (!data) {
      modlogChannel = '`None`';
    } else {
      if (data.moderation) {
        modlogChannel = `<#${data.moderation.id}>`;
      } else modlogChannel = '`None`';
    }

    const continueButton = new ButtonBuilder()
      .setCustomId(`setup_continue_from_modlog`)
      .setLabel('Continue')
      .setEmoji(GirEmojis.Right)
      .setStyle(ButtonStyle.Success);

    const modlogChannelSelectMenu = new ChannelSelectMenuBuilder()
      .setCustomId('setup_modlog')
      .setMaxValues(1)
      .setMinValues(1)
      .setPlaceholder('Select modlog channel')
      .setChannelTypes([ChannelType.GuildText]);

    const modlogSetupEmbed = new EmbedBuilder()
      .setTitle('Modlog Channel Select')
      .setColor(GirColors.Default)
      .setDescription(
        'Select the servers modlog channel. Logs about the moderation such as mutes, unmutes, warns, bans and other actions will be sent in this channel.'
      )
      .addFields({ name: 'Modlog Channel', value: `${modlogChannel}` });

    await interaction.update({
      embeds: [modlogSetupEmbed],
      components: [
        new ActionRowBuilder<ChannelSelectMenuBuilder>().addComponents(
          modlogChannelSelectMenu
        ),
        new ActionRowBuilder<ButtonBuilder>().addComponents(continueButton),
      ],
    });
  }

  private async messageChannel(interaction: ButtonInteraction) {
    const data = await loggingSchema
      .findOne({ _id: interaction.guildId })
      .select(['message']);

    let messageChannel: string;
    if (!data) {
      messageChannel = '`None`';
    } else {
      if (data.message) {
        messageChannel = `<#${data.message.id}>`;
      } else messageChannel = '`None`';
    }

    const continueButton = new ButtonBuilder()
      .setCustomId(`setup_continue_from_message`)
      .setLabel('Continue')
      .setEmoji(GirEmojis.Right)
      .setStyle(ButtonStyle.Success);

    const messageChannelSelectMenu = new ChannelSelectMenuBuilder()
      .setCustomId('setup_message')
      .setMaxValues(1)
      .setMinValues(1)
      .setPlaceholder('Select message logging channel')
      .setChannelTypes([ChannelType.GuildText]);

    const messageSetupEmbed = new EmbedBuilder()
      .setTitle('Message Logging Channel Select')
      .setColor(GirColors.Default)
      .setDescription(
        'Select the servers message logging channel. Logs about message deletions, edits and other actions will be sent to this channel.'
      )
      .addFields({
        name: 'Message logging Channel',
        value: `${messageChannel}`,
      });

    await interaction.update({
      embeds: [messageSetupEmbed],
      components: [
        new ActionRowBuilder<ChannelSelectMenuBuilder>().addComponents(
          messageChannelSelectMenu
        ),
        new ActionRowBuilder<ButtonBuilder>().addComponents(continueButton),
      ],
    });
  }

  private async memberChannel(interaction: ButtonInteraction) {
    const data = await loggingSchema
      .findOne({ _id: interaction.guildId })
      .select(['member']);

    let memberChannel: string;
    if (!data) {
      memberChannel = '`None`';
    } else {
      if (data.member) {
        memberChannel = `<#${data.member.id}>`;
      } else memberChannel = '`None`';
    }

    const continueButton = new ButtonBuilder()
      .setCustomId(`setup_continue_from_member`)
      .setLabel('Continue')
      .setEmoji(GirEmojis.Right)
      .setStyle(ButtonStyle.Success);

    const memberChannelSelectMenu = new ChannelSelectMenuBuilder()
      .setCustomId('setup_member')
      .setMaxValues(1)
      .setMinValues(1)
      .setPlaceholder('Select member logging channel')
      .setChannelTypes([ChannelType.GuildText]);

    const memberSetupEmbed = new EmbedBuilder()
      .setTitle('Member Logging Channel Select')
      .setColor(GirColors.Default)
      .setDescription(
        'Select the servers member logging channel. Logs about member joins, leaves and other actions will be sent to this channel.'
      )
      .addFields({
        name: 'Member Logging Channel',
        value: `${memberChannel}`,
      });

    await interaction.update({
      embeds: [memberSetupEmbed],
      components: [
        new ActionRowBuilder<ChannelSelectMenuBuilder>().addComponents(
          memberChannelSelectMenu
        ),
        new ActionRowBuilder<ButtonBuilder>().addComponents(continueButton),
      ],
    });
  }

  private async serverChannel(interaction: ButtonInteraction) {
    const data = await loggingSchema
      .findOne({ _id: interaction.guildId })
      .select(['server']);

    let serverChannel: string;
    if (!data) {
      serverChannel = '`None`';
    } else {
      if (data.server) {
        serverChannel = `<#${data.server.id}>`;
      } else serverChannel = '`None`';
    }

    const continueButton = new ButtonBuilder()
      .setCustomId(`setup_continue_from_server`)
      .setLabel('Continue')
      .setEmoji(GirEmojis.Right)
      .setStyle(ButtonStyle.Success);

    const serverChannelSelectMenu = new ChannelSelectMenuBuilder()
      .setCustomId('setup_server')
      .setMaxValues(1)
      .setMinValues(1)
      .setPlaceholder('Select server logging channel')
      .setChannelTypes([ChannelType.GuildText]);

    const serverSetupEmbed = new EmbedBuilder()
      .setTitle('Server Logging Channel Select')
      .setColor(GirColors.Default)
      .setDescription(
        'Select the servers server logging channel. Logs about server updates will be sent to this channel.'
      )
      .addFields({
        name: 'Server Logging Channel',
        value: `${serverChannel}`,
      });

    await interaction.update({
      embeds: [serverSetupEmbed],
      components: [
        new ActionRowBuilder<ChannelSelectMenuBuilder>().addComponents(
          serverChannelSelectMenu
        ),
        new ActionRowBuilder<ButtonBuilder>().addComponents(continueButton),
      ],
    });
  }

  private async channelChannel(interaction: ButtonInteraction) {
    const data = await loggingSchema
      .findOne({ _id: interaction.guildId })
      .select(['channel']);

    let channelChannel: string;
    if (!data) {
      channelChannel = '`None`';
    } else {
      if (data.channel) {
        channelChannel = `<#${data.channel.id}>`;
      } else channelChannel = '`None`';
    }

    const continueButton = new ButtonBuilder()
      .setCustomId(`setup_continue_from_channel`)
      .setLabel('Continue')
      .setEmoji(GirEmojis.Right)
      .setStyle(ButtonStyle.Success);

    const channelChannelSelectMenu = new ChannelSelectMenuBuilder()
      .setCustomId('setup_channel')
      .setMaxValues(1)
      .setMinValues(1)
      .setPlaceholder('Select channel logging channel')
      .setChannelTypes([ChannelType.GuildText]);

    const channelSetupEmbed = new EmbedBuilder()
      .setTitle('Channel Logging Channel Select')
      .setColor(GirColors.Default)
      .setDescription(
        'Select the servers channel logging channel. Logs about channel creations, deletions and other actions will be sent to this channel.'
      )
      .addFields({
        name: 'Channel Logging Channel',
        value: `${channelChannel}`,
      });

    await interaction.update({
      embeds: [channelSetupEmbed],
      components: [
        new ActionRowBuilder<ChannelSelectMenuBuilder>().addComponents(
          channelChannelSelectMenu
        ),
        new ActionRowBuilder<ButtonBuilder>().addComponents(continueButton),
      ],
    });
  }

  private async roleChannel(interaction: ButtonInteraction) {
    const data = await loggingSchema
      .findOne({ _id: interaction.guildId })
      .select(['role']);

    let roleChannel: string;
    if (!data) {
      roleChannel = '`None`';
    } else {
      if (data.role) {
        roleChannel = `<#${data.role.id}>`;
      } else roleChannel = '`None`';
    }

    const continueButton = new ButtonBuilder()
      .setCustomId(`setup_continue_from_role`)
      .setLabel('Continue')
      .setEmoji(GirEmojis.Right)
      .setStyle(ButtonStyle.Success);

    const roleChannelSelectMenu = new ChannelSelectMenuBuilder()
      .setCustomId('setup_role')
      .setMaxValues(1)
      .setMinValues(1)
      .setPlaceholder('Select role logging channel')
      .setChannelTypes([ChannelType.GuildText]);

    const roleSetupEmbed = new EmbedBuilder()
      .setTitle('Role Logging Channel Select')
      .setColor(GirColors.Default)
      .setDescription(
        'Select the servers role logging channel. Logs about role creations, deletions and other actions will be sent to this channel.'
      )
      .addFields({
        name: 'Role Logging Channel',
        value: `${roleChannel}`,
      });

    await interaction.update({
      embeds: [roleSetupEmbed],
      components: [
        new ActionRowBuilder<ChannelSelectMenuBuilder>().addComponents(
          roleChannelSelectMenu
        ),
        new ActionRowBuilder<ButtonBuilder>().addComponents(continueButton),
      ],
    });
  }

  private async end(interaction: ButtonInteraction) {
    const embed = new EmbedBuilder()
      .setColor(GirColors.Success)
      .setDescription(
        'You have now successfully completed the server setup process for Gir-Unit'
      )
      .setTitle('Completed Server Setup');
    await interaction.update({
      embeds: [embed],
      components: [],
    });

    let channels: any[] = [];
    const data = await loggingSchema.findOne({ _id: interaction.guildId });
    if (data) {
      channels.push(
        [data.message, 'message'],
        [data.member, 'member'],
        [data.server, 'server'],
        [data.channel, 'channel'],
        [data.role, 'role']
      );
      channels.forEach(async (channelData) => {
        const webhook = new WebhookClient({
          url: channelData[0].url,
        });
        const embed = new EmbedBuilder()
          .setColor(GirColors.Success)
          .setDescription(
            `${GirEmojis.Success} This channel has been successfully set as the **${channelData[1]} logging channel**`
          );

        await webhook
          .send({
            avatarURL: GirAvatar,
            username: GirUsername,
            embeds: [embed],
          })
          .catch(() => null);
      });
    }
  }

  public override parse(interaction: ButtonInteraction) {
    if (interaction.componentType !== ComponentType.Button) return this.none();
    if (!interaction.customId.startsWith('setup_')) return this.none();

    return this.some();
  }
}
