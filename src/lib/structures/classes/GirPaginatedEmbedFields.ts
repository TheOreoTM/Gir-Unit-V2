import { GirEmojis } from '#constants';
import {
  PaginatedMessage,
  PaginatedMessageEmbedFields,
  type PaginatedMessageOptions,
} from '@sapphire/discord.js-utilities';
import {
  ButtonStyle,
  ComponentType,
  MessageComponentInteraction,
} from 'discord.js';

export class GirPaginatedMessageEmbedFields extends PaginatedMessageEmbedFields {
  public constructor(options: PaginatedMessageOptions = {}) {
    super(options);
    this.setActions([
      {
        customId: '@sapphire/paginated-messages.firstPage',
        style: ButtonStyle.Secondary,
        emoji: GirEmojis.Backward,
        type: ComponentType.Button,
        run: ({ handler, interaction }) => {
          handler.index = 0;
          this.updateComponents(handler, interaction);
        },
      },
      {
        customId: '@sapphire/paginated-messages.previousPage',
        style: ButtonStyle.Secondary,
        emoji: GirEmojis.Left,
        type: ComponentType.Button,
        run: ({ handler, interaction }) => {
          if (handler.index === 0) {
            handler.index = handler.pages.length - 1;
          } else {
            --handler.index;
          }
          this.updateComponents(handler, interaction);
        },
      },
      {
        customId: '@sapphire/paginated-messages.stop',
        style: ButtonStyle.Secondary,
        emoji: GirEmojis.Stop,
        type: ComponentType.Button,
        run: ({ collector }) => collector.stop(),
      },
      {
        customId: '@sapphire/paginated-messages.nextPage',
        style: ButtonStyle.Secondary,
        emoji: GirEmojis.Right,
        type: ComponentType.Button,
        run: ({ handler, interaction }) => {
          if (handler.index === handler.pages.length - 1) {
            handler.index = 0;
          } else {
            ++handler.index;
          }
          this.updateComponents(handler, interaction);
        },
      },
      {
        customId: '@sapphire/paginated-messages.goToLastPage',
        style: ButtonStyle.Secondary,
        emoji: GirEmojis.Forward,
        type: ComponentType.Button,
        run: ({ handler, interaction }) => {
          handler.index = handler.pages.length - 1;
          this.updateComponents(handler, interaction);
        },
      },
    ]);
  }

  private updateComponents(
    handler: PaginatedMessage,
    interaction: MessageComponentInteraction
  ) {
    const page = handler.messages[handler.index]!;
    // @ts-expect-error lol
    page.components = interaction.message.components;
  }
}
