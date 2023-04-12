import type { ModlogData } from '#lib/types';
import { err } from '@sapphire/framework';
import type { Guild, GuildMember, Snowflake } from 'discord.js';
import randomatic from 'randomatic';
import modnickSchema from '../schemas/modnick-schema';
import { Modlog } from './Modlog';

export class Modnick {
  public constructor(private readonly guild: Guild) {}

  public async create(
    member: GuildMember,
    staff: GuildMember,
    nickname: string | undefined,
    frozen: boolean
  ) {
    if (!member || !staff) throw new Error('Member or staff is null');
    nickname = nickname?.slice(0, 32);
    const identifier = nickname ? nickname : randomatic('Aa', 8);
    const modnick = nickname ? nickname : `Moderated Nickname ${identifier}`;

    await modnickSchema.findOneAndUpdate(
      { guildId: this.guild.id, userId: member.id },
      {
        guildId: this.guild.id,
        userId: member.id,
        nickname: modnick,
        oldNickname: member.displayName,
        identifier: identifier,
        frozen: frozen ? frozen : false,
      },
      {
        upsert: true,
      }
    );

    await member
      .setNickname(modnick, `Modnick used: ${staff.user.tag}`)
      .catch((Err) => err(Err));

    // create modlog
    const modlogData: ModlogData = {
      guild: this.guild,
      action: 'modnick',
      member: member,
      staff: staff,
      reason: `Nickname changed to \`${identifier}\``,
    };
    const log = new Modlog(modlogData);
    await log.create();

    return { identifier: identifier, caseNum: log.case };
  }

  public async get(userId: Snowflake) {
    const userData = await modnickSchema.findOne({
      guildId: this.guild.id,
      userId: userId,
    });
    return userData;
  }
}
