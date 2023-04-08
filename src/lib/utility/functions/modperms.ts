import { GirEmojis as Emojis } from '#constants';
import { GuildMember, User } from 'discord.js';
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
  let content: string;
  if (target instanceof User) {
    result = true;
    content = '';
  } else if (!target.manageable || isAdmin(target)) {
    result = false;
    content = `${Emojis.fail} I can't ${action} ${target}`;
  } else if (
    executor.roles.highest.position === target.roles.highest.position
  ) {
    content = `${Emojis.fail} You can't ${action} ${target}`;
    result = false;
  } else {
    (result = true), (content = '');
  }
  return { result, content };
}
