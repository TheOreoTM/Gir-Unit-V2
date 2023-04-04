import { Command } from '@sapphire/framework';
import type { Message } from 'discord.js';

export class PingCommand extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      name: 'ping',
      aliases: ['pong'],
      description: 'ping pong',
      cooldownDelay: 7_000,
      cooldownLimit: 1,
    });
  }
  public async messageRun(message: Message) {
    const msg = await message.reply('Ping');
    const ping = Math.floor(message.client.ws.ping);
    setTimeout(() => {
      msg.edit(`Ping \`${ping}ms\``);
    }, ping);
  }
}
