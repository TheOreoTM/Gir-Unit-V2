import { ModColors } from '#constants';
import type { modAction } from '#lib/types';
import { EmbedBuilder, GuildMember, User } from 'discord.js';
import { ms } from 'enhanced-ms';

export function generateModLogEmbed({
  member,
  staff,
  action,
  reason,
  caseNum,
  length,
}: {
  member: GuildMember | User;
  staff: GuildMember | User;
  action: modAction;
  caseNum: string;
  reason: string;
  length?: number;
}) {
  const formattedAction = actions[action];
  const memberTag =
    member instanceof GuildMember ? member.user.tag : member.tag;

  const embed = new EmbedBuilder()
    .setColor(ModColors[action])
    .setAuthor({
      name: `Case ${caseNum} | ${formattedAction} | ${memberTag}`,
    })
    .addFields(
      {
        inline: true,
        name: `User`,
        value: [`<@${member.id}>`].join('\n'),
      },
      {
        inline: true,
        name: 'Moderator',
        value: [`<@${staff.id}>`].join('\n'),
      }
    );

  if (length) {
    embed.addFields({
      inline: true,
      name: 'Length',
      value: `${ms(length, { shortFormat: false })}`,
    });
  }

  embed.addFields({ inline: true, name: 'Reason', value: reason });

  return embed;
}

const actions = {
  warn: 'Warn',
  warn_remove: 'Warn Removal',
  kick: 'Kick',
  ban: 'Ban',
  softban: 'Softban',
  unban: 'Unban',
  modnick: 'Modnick',
  mute: 'Mute',
  unmute: 'Unmute',
};
