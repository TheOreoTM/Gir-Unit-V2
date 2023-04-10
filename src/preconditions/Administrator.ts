import { PermissionsPrecondition } from '#lib/structures';
import type { GuildMessage } from '#lib/types';
import { isAdmin } from '#lib/utility';

export class UserPermissionsPrecondition extends PermissionsPrecondition {
  public override async handle(
    message: GuildMessage
  ): PermissionsPrecondition.AsyncResult {
    const roles = (await message.guild.settings?.staffroles.admins) ?? [];
    const allowed =
      isAdmin(message.member) ||
      message.member.roles.cache.some((r) => roles.includes(r.id));

    return allowed
      ? this.ok()
      : this.error({
          identifier: `Error`,
          message: `This command is only for admins`,
        });
  }
}

declare module '@sapphire/framework' {
  interface Preconditions {
    Administrator: never;
  }
}
