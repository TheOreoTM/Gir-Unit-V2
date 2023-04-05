import { Precondition } from '@sapphire/framework';
import type { Message } from 'discord.js';

export class OwnerOnlyPrecondition extends Precondition {
  public override async messageRun(message: Message) {
    // for Message Commands
    return this.checkOwner(message.author.id);
  }

  private async checkOwner(userId: string) {
    return userId === '600707283097485322'
      ? this.ok()
      : this.error({ message: 'Only the bot owner can use this command!' });
  }
}

declare module '@sapphire/framework' {
  interface Preconditions {
    OwnerOnly: never;
  }
}
