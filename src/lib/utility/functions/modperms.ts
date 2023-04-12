import { FailEmbed, SuccessEmbed } from '#lib/structures';
import { EmbedBuilder, GuildMember, User } from 'discord.js';
import { isAdmin } from './permissions';
/**
 * Runs all checks before executing a moderation command
 * @param executor The member who executed the command
 * @param target The member who was targeted
 * @param action The action that was executed
 */
export function runAllChecks(
  executor: GuildMember,
  target: GuildMember | User,
  action: string
) {
  let result: boolean;
  let content: EmbedBuilder;
  if (target instanceof User) {
    result = true;
    content = new SuccessEmbed(``);
  } else if (!target.manageable || isAdmin(target)) {
    result = false;
    content = new FailEmbed(`I can't ${action} ${target}`);
  } else if (
    executor.roles.highest.position === target.roles.highest.position
  ) {
    content = new FailEmbed(`You can't ${action} ${target}`);
    result = false;
  } else {
    (result = true), (content = new SuccessEmbed(''));
  }
  return { result, content };
}
