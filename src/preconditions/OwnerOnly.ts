import { Precondition } from '@sapphire/framework';
import type {
  ChatInputCommandInteraction,
  ContextMenuCommandInteraction,
  Message,
  Snowflake,
} from 'discord.js';
const OWNERS = ['600707283097485322'];

export class OwnerOnlyPrecondition extends Precondition {
  #message = 'This command can only be used by the owner.';
  public override messageRun(message: Message) {
    return this.doOwnerCheck(message.author.id);
  }

  public override chatInputRun(interaction: ChatInputCommandInteraction) {
    return this.doOwnerCheck(interaction.user.id);
  }

  public override contextMenuRun(interaction: ContextMenuCommandInteraction) {
    return this.doOwnerCheck(interaction.user.id);
  }

  private doOwnerCheck(userId: Snowflake) {
    return OWNERS.includes(userId)
      ? this.ok()
      : this.error({ message: this.#message });
  }
}

declare module '@sapphire/framework' {
  interface Preconditions {
    OwnerOnly: never;
  }
}
