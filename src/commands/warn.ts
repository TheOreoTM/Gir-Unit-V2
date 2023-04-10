import { Warn } from '#lib/structures/classes/Warn';
import { ApplyOptions } from '@sapphire/decorators';
import { Args, Command } from '@sapphire/framework';
import type { Message } from 'discord.js';

@ApplyOptions<Command.Options>({
  description: 'A basic command',
  name: 'warn',
  preconditions: ['GuildOnly'],
})
export class UserCommand extends Command {
  public async messageRun(message: Message, args: Args) {
    if (!message.member) return;
    const target = await args.pick('member');
    const reason = await args.rest('string');

    const warn = new Warn(target, message.member, reason);
    await warn.generateModlog(message.guild);
    await message.channel.send(
      `\`\`\`json\n${JSON.stringify(warn, null, 2)}\`\`\``
    );
  }
}
