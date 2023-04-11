import { PermissionsPrecondition } from '#lib/structures';
import type { GuildMessage } from '#lib/types';
import { isAdmin, isModerator, isStaff } from '#lib/utility';

export class UserPermissionsPrecondition extends PermissionsPrecondition {
  public override async handle(
    message: GuildMessage
  ): PermissionsPrecondition.AsyncResult {
    const staffRoles = (await message.guild.settings?.staffroles.staffs) ?? [];
    const modRoles = (await message.guild.settings?.staffroles.mods) ?? [];
    const adminRoles = (await message.guild.settings?.staffroles.admins) ?? [];
    const allowed =
      isAdmin(message.member) ||
      isModerator(message.member) ||
      isStaff(message.member) ||
      message.member.roles.cache.some((r) =>
        adminRoles.concat(modRoles).concat(staffRoles).includes(r.id)
      );

    return allowed
      ? this.ok()
      : this.error({
          identifier: `Not a staff`,
          message: `This command is only for staffs`,
        });
  }
}
