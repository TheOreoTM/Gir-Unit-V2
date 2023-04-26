import type { GuildMessage } from '#lib/types';
import { GuildMember, User } from 'discord.js';
import { isGuildOwner } from '..';

export async function checkModeratable(
  message: GuildMessage,
  user: GuildMember | null
): Promise<checkModeratableOutput> {
  let target: User;
  let value: string = '';
  let success: boolean = true;

  if (!user) {
    return { member: user, value: 'Provide a valid user', success: false };
  }
  if (user instanceof User) {
    target = user as User;
  } else {
    target = user.user as User;
  }

  if (target.id === message.author.id) {
    success = false;
    value = 'You cant moderate yourself';
  }

  if (target.id === message.client.user.id) {
    success = false;

    value = 'After everything i have done for you';
  }

  const member = await message.guild.members.fetch(target.id).catch(() => {
    return null;
  });

  if (!member) {
    success = false;

    value = 'That user is not in the guild';
  }

  if (member) {
    const targetHighestRolePosition = member.roles.highest.position;

    // Gir cannot moderate members with higher role position than him:
    if (
      targetHighestRolePosition >=
      message.guild.members.me!.roles.highest.position
    ) {
      success = false;

      value = 'That user has a higher role than me';
    }

    // A member who isn't a server owner is not allowed to moderate somebody with higher role than them:
    if (
      !isGuildOwner(message.member) &&
      targetHighestRolePosition >= message.member.roles.highest.position
    ) {
      success = false;

      value = 'That user has a higher role than you';
    }
  }

  return { member: member, value: value, success: success };
}

interface checkModeratableOutput {
  member: GuildMember | null;
  value: string;
  success: boolean;
}
