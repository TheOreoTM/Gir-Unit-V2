import { GirEvents } from '#lib/types';
import { ApplyOptions } from '@sapphire/decorators';
import { Awaitable, Listener } from '@sapphire/framework';
import { Nullish, isNullish } from '@sapphire/utilities';
import {
  DiscordAPIError,
  EmbedBuilder,
  Guild,
  HTTPError,
  MessageCreateOptions,
  WebhookClient,
} from 'discord.js';

@ApplyOptions<Listener.Options>({
  event: GirEvents.GuildMessageLog,
})
export class UserEvent extends Listener {
  public override async run(
    guild: Guild,
    webhook: WebhookClient | Nullish,
    makeMessage: () => Awaitable<EmbedBuilder | MessageCreateOptions>
  ) {
    if (isNullish(webhook)) return;

    const processed = await makeMessage();

    const options: MessageCreateOptions =
      processed instanceof EmbedBuilder ? { embeds: [processed] } : processed;

    try {
      await webhook.send(options);
    } catch (error) {
      this.container.logger.fatal(
        error instanceof DiscordAPIError || error instanceof HTTPError
          ? `Failed to send  log for guild ${guild} in webhook ${webhook.id}. Error: [${error.status} - ${error.method} | ${error.url}] ${error.message}`
          : `Failed to send  log for guild ${guild} in channel ${
              webhook.id
            }. Error: ${(error as Error).message}`
      );
    }
  }
}
