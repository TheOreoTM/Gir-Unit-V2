import { Precondition } from '@sapphire/framework';
import type { Message } from 'discord.js';
import { OWNERS } from '../lib/constants';

export class OwnerOnlyPrecondition extends Precondition {
  public override async messageRun(message: Message) {
    // for Message Commands
    return this.checkOwner(message.author.id);
  }

  private async checkOwner(userId: string) {
    return OWNERS.includes(userId)
      ? this.ok()
      : this.error({ message: 'Only the bot owner can use this command!' });
  }
}

declare module '@sapphire/framework' {
  interface Preconditions {
    OwnerOnly: never;
  }
}
