import type { ModlogData } from '#lib/types';
import type { Guild, GuildMember, Snowflake } from 'discord.js';
import randomatic from 'randomatic';
import modnickSchema from '../schemas/modnick-schema';
import { Modlog } from './Modlog';

export class Modnick {
  public constructor(private readonly guild: Guild) {}

  public async create(
    member: GuildMember | null,
    staff: GuildMember | null,
    nickname?: string
  ) {
    if (!member || !staff) throw new Error('Member or staff is null');

    const identifier = randomatic('Aa', 8);
    const modnick = nickname ? nickname : `Moderated Nickname ${identifier}`;

    await member
      .setNickname(modnick, `Modnick used: ${staff.user.tag}`)
      .catch(() => null);

    // create modlog
    const modlogData: ModlogData = {
      guild: this.guild,
      action: 'modnick',
      member: member,
      staff: staff,
      reason: 'Modnick command used',
    };
    const log = new Modlog(modlogData);
    await log.create();
  }

  public async fetch(userId: Snowflake) {
    const userData = await modnickSchema.findOne({
      guildId: this.guild.id,
      userId: userId,
    });
    return userData;
  }
}
