import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import type { Message } from 'discord.js';
import messageSchema from '../../schemas/message-schema';

@ApplyOptions<Command.Options>({
  description: 'A basic command',
})
export class UserCommand extends Command {
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
