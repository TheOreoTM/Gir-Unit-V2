import { GirCommand } from '#lib/structures';
import { ApplyOptions } from '@sapphire/decorators';
import type { Message } from 'discord.js';
import messageSchema from '../../lib/structures/schemas/message-schema';

@ApplyOptions<GirCommand.Options>({
  description: 'A basic command',
  hidden: true,
})
export class UserCommand extends GirCommand {
  public async messageRun(message: Message) {
    await messageSchema.create({
      _id: message.id,
      userId: message.author.id,
      channelId: message.channelId,
      guildId: message.guildId,
    });
    return message.channel.send(
      `Added a record for ${message.content} in the DB`
    );
  }
}
