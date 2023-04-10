import type { GirCommand } from '#lib/structures';
import {
  isAdmin,
  isGuildOwner,
  isModerator,
  isOwner,
  isStaff,
  isTrainee,
} from '#lib/utility';
import { createFunctionPrecondition } from '@sapphire/decorators';
import { UserError } from '@sapphire/framework';
import type { GuildMember } from 'discord.js';

export const PermissionLevel = (level: PermissionLevel): MethodDecorator => {
  return createFunctionPrecondition(async (message: GirCommand.Message) => {
    const adminRoles = (await message.guild.settings?.staffroles.admins) ?? [];
    const modRoles = (await message.guild.settings?.staffroles.mods) ?? [];
    const staffRoles = (await message.guild.settings?.staffroles.staffs) ?? [];
    const traineeRoles =
      (await message.guild.settings?.staffroles.trainees) ?? [];

    const admin =
      isAdmin(message.member as GuildMember) ||
      message.member.roles.cache.some((r) => adminRoles.includes(r.id));

    const mod =
      admin ||
      isModerator(message.member) ||
      message.member.roles.cache.some((r) => modRoles.includes(r.id));

    const staff =
      admin ||
      mod ||
      isStaff(message.member) ||
      message.member.roles.cache.some((r) => staffRoles.includes(r.id));

    const trainee =
      admin ||
      mod ||
      staff ||
      isTrainee(message.member) ||
      message.member.roles.cache.some((r) => traineeRoles.includes(r.id));

    const serverowner = isGuildOwner(message.member);
    if (isOwner(message.member.user)) return true;

    let error: string;
    switch (level) {
      case 'Administrator':
        error = `This command is only for admins`;
        if (!admin)
          throw new UserError({
            identifier: 'PermissionLevelError',
            message: error,
          });
        return admin;
      case 'Moderator':
        error = `This command is only for moderators`;
        if (!mod)
          throw new UserError({
            identifier: 'PermissionLevelError',
            message: error,
          });
        return mod;
      case 'Staff':
        error = `This command is only for staffs`;
        if (!staff)
          throw new UserError({
            identifier: 'PermissionLevelError',
            message: error,
          });
        return staff;
      case 'Trainee':
        error = `This command is only for Trainees`;
        if (!mod)
          throw new UserError({
            identifier: 'PermissionLevelError',
            message: error,
          });
        return trainee;
      case 'ServerOwner':
        error = `This command is only for the server owner`;
        if (!serverowner)
          throw new UserError({
            identifier: 'PermissionLevelError',
            message: error,
          });
        return serverowner;
      case 'Everyone':
        return true;
    }
  });
};

export type PermissionLevel =
  | 'Administrator'
  | 'Moderator'
  | 'Staff'
  | 'Trainee'
  | 'ServerOwner'
  | 'Everyone';
