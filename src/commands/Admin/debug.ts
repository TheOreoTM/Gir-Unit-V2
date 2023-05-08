import {
  GirColors,
  GirEmojis,
  RecommendedPermissions,
  RecommendedPermissionsWithoutAdmin,
} from '#constants';
import {
  Embed,
  GirCommand,
  GirPaginatedMessageEmbedFields,
  LoadingEmbed,
  SuccessEmbed,
} from '#lib/structures';
import { mention, sec } from '#lib/utility';
import { ApplyOptions } from '@sapphire/decorators';
import { BucketScope } from '@sapphire/framework';
import { send, track } from '@sapphire/plugin-editable-commands';
import { ChannelType, PermissionFlagsBits, type Guild } from 'discord.js';

@ApplyOptions<GirCommand.Options>({
  description: 'A basic command',
  name: 'debug',
  cooldownDelay: sec(20),
  cooldownScope: BucketScope.Guild,
})
export class debugCommand extends GirCommand {
  readonly #SelectMessages = [
    ['Server Setup', 'The /setup'],
    ['Server Permissions', 'My permissions in the server'], //
    [
      'Per Channel Permissions',
      'The per channel perms especially for locking mechanism',
    ],
    ['Roles', 'The amount of roles in server'],
  ];

  readonly #Counts = {
    Low: { Admins: { min: 1, max: 3 }, Roles: { min: 5, max: 20 } },
    Medium: { Admins: { min: 1, max: 5 }, Roles: { min: 10, max: 50 } },
    High: { Admins: { min: 2, max: 10 }, Roles: { min: 10, max: 100 } },
  };

  readonly #GuildSize = {
    Low: 50,
    Medium: 10000,
    High: 500000,
  };

  public override async messageRun(message: GirCommand.Message) {
    const title = '__**Results**__';

    const msg = new GirPaginatedMessageEmbedFields() //
      .setSelectMenuPlaceholder('View Results')
      .setSelectMenuOptions((i) => ({
        label: this.#SelectMessages[i - 1][0],
        description: this.#SelectMessages[i - 1][1],
      }));

    const results: string[] = [];

    const response = await send(message, {
      embeds: [new LoadingEmbed(`Debugging...`)],
    });
    track(message, response);

    results.push(await this.setupCheck(message));
    results.push(await this.guildPermissions(message));
    results.push(await this.perChannelPermissions(message));
    results.push(await this.role(message));

    results.forEach((r, i) => {
      const color = r.includes(GirEmojis.Fail)
        ? GirColors.Fail
        : GirColors.Success;
      msg.addPageEmbed(
        new Embed()
          ._color(color || GirColors.Default)
          ._description(r)
          ._title(`${title} [${i + 1}/${this.#SelectMessages.length}]`)
      );
    });
    await send(message, {
      embeds: [new SuccessEmbed(`Debugging complete. The report is below.`)],
    });
    await msg.run(message);
    return;
  }

  private async role(message: GirCommand.Message) {
    await send(message, {
      embeds: [new LoadingEmbed(`Checking Roles...`)],
    });

    const { guild, client } = message;
    const notes: string[] = [];
    const roles = (await guild.roles.fetch()).filter((r) => !r.managed);
    const { everyone } = guild.roles;
    const admins = roles.filter((r) =>
      r.permissions.has(PermissionFlagsBits.Administrator)
    ).size;
    const totalRoles = roles.size;

    const counts = this.getRecommendedCounts(guild);

    const size = (max: number, cur: number, min: number) =>
      Math.min(max - cur, cur - min) === max - cur ? '__High__' : '__Low__';

    if (!this.range(counts.Admins.max, admins, counts.Admins.min))
      notes.push(
        this.note(
          `Too ${size(
            counts.Admins.max,
            admins,
            counts.Admins.min
          )} [**${admins}**] amount of Roles with Administrator Permissions!`
        )
      );
    if (!this.range(counts.Roles.max, totalRoles, counts.Roles.min))
      notes.push(
        this.note(
          `Too ${size(
            counts.Roles.max,
            totalRoles,
            counts.Roles.min
          )} [**${totalRoles}**] amount of Roles in Server!`
        )
      );

    if (everyone.permissions.has(PermissionFlagsBits.Administrator)) {
      notes.push(
        this.note(
          `@everyone Role should **NOT** have Administrator Permissions!`
        )
      );
    }

    // Hierarchy

    const me = guild.members.me ?? (await guild.members.fetch(client.user.id));
    const topRole = me.roles.highest;

    if (topRole.position / totalRoles <= 0.7)
      notes.push(this.note(`My highest role [${topRole}] is too low!`));
    if (topRole.id === guild.id)
      notes.push(
        this.note(
          'My highest Role is @everyone and it will cause issues with commands, please assign a higher role to me!'
        )
      );

    if (!notes.length) return `> Role  \n${GirEmojis.Success} Perfect!`;
    notes.unshift(`> Role  \n${GirEmojis.Fail} Issues Found!`);

    return notes
      .join('\n')
      .concat(
        `\n\n> *Tip: Role Hierarchy plays an important role in moderation!*`
      );
  }

  private async guildPermissions(message: GirCommand.Message) {
    await send(message, {
      embeds: [new LoadingEmbed(`Checking Overall Permissions...`)],
    });

    const notes: string[] = [];

    const me =
      message.guild.members.me ??
      (await message.guild.members.fetch(message.client.user.id));
    notes.push(
      ...this.container.utils
        .format(me.permissions.missing(RecommendedPermissions))
        .map((p) => this.note(p))
    );

    if (!notes.length)
      return `> Server Permissions \n${GirEmojis.Success} Perfect!`;
    notes.unshift(
      `> Server Permissions \n${GirEmojis.Fail} Permissions Missing!`
    );

    return notes.join('\n');
  }

  private async setupCheck(message: GirCommand.Message) {
    await send(message, {
      embeds: [new LoadingEmbed(`Checking Setup...`)],
    });

    const modlog = await message.guild.logging?.moderation;
    const trainees = await message.guild.settings?.staffroles.trainees;
    const staffs = await message.guild.settings?.staffroles.staffs;
    const mods = await message.guild.settings?.staffroles.mods;
    const admins = await message.guild.settings?.staffroles.admins;

    const notes: string[] = [];

    if (modlog) {
      const channel = modlog;
      if (!channel)
        notes.push(this.note(`No Modlogs channel found with ID \`${modlog}\``));
    } else notes.push(this.note(`No Modlogs channel setup found`));

    const roles = [trainees, staffs, mods, admins];
    for (let k = 0; k < 4; k++) {
      const impRole = roles.shift()!;
      let key: string = '';
      switch (k) {
        case 0:
          key = 'Trainee';
          break;
        case 1:
          key = 'Staff';
          break;
        case 2:
          key = 'Moderator';
          break;
        case 3:
          key = 'Admin';
          break;
      }
      if (impRole.length) {
        const roles = impRole.map((r) => message.guild.roles.cache.get(r));
        for (let i = 0; i < roles.length; i++) {
          const role = roles[i];
          if (!role)
            notes.push(
              this.note(`No ${key} Role found with ID \`${impRole[i]}\``)
            );
        }
      } else notes.push(this.note(`No ${key} Roles setup found`));
    }

    if (!notes.length) return `> Server Setup \n${GirEmojis.Success} Perfect!`;
    notes.unshift(`> Server Setup \n${GirEmojis.Fail} Issues found!`);

    return notes
      .join('\n')
      .concat(
        `\n\n> *TIP: Use ${await mention(
          'setup',
          message.client
        )} to fix the issues*`
      );
  }

  private async perChannelPermissions(message: GirCommand.Message) {
    await send(message, {
      embeds: [new LoadingEmbed(`Checking per channel overwrites...`)],
    });

    const channels = message.guild.channels.cache.filter(
      (c) => c.type !== ChannelType.GuildCategory
    );
    const me =
      message.guild.members.me ??
      (await message.guild.members.fetch(message.client.user.id));
    const notes: string[] = [];

    for (const channel of channels.values()) {
      const perm = channel.permissionsFor(me);
      const missing = this.container.utils
        .format(perm.missing(RecommendedPermissionsWithoutAdmin))
        .map((c) => `\`${c}\``);
      if (missing.length) {
        notes.push(
          this.note(
            `<#${channel.id}> [${
              missing.length > 3
                ? `${missing.length} Permissions`
                : `${missing.join(', ')}`
            }] `
          )
        );
      }
    }

    if (!notes.length)
      return `> Per Channel Permissions \n${GirEmojis.Success} Perfect!`;
    notes.unshift(
      `> Per Channel Permissions \n${GirEmojis.Fail} Permission Overwrites found!`
    );

    return notes
      .join('\n')
      .concat(
        '\n\n> *Tip: Granting `Administrator` Permission can solve all permission related issues, but it is not a necessity for me to function*'
      );
  }

  private getRecommendedCounts(guild: Guild) {
    const { memberCount } = guild;
    let guildSize: Size = 'Low';
    if (memberCount >= this.#GuildSize.Medium) guildSize = 'Medium';
    if (memberCount >= this.#GuildSize.High) guildSize = 'High';
    return this.#Counts[guildSize];
  }

  private range(max: number, x: number, min: number) {
    return x >= min && x <= max;
  }

  private note(text: string) {
    return `\` - \` ${text}`;
  }
}

type Size = 'High' | 'Medium' | 'Low';
