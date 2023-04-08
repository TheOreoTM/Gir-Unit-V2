import { GirColors, GirEmojis, RandomLoadingMessage } from '#constants';
import { pickRandom } from '#lib/utility';
import { EmbedBuilder } from 'discord.js';

export class SuccessEmbed extends EmbedBuilder {
  constructor(description: string) {
    super();
    this.setColor(GirColors.success);
    this.setDescription(`***${GirEmojis.success} ${description}***`);
  }
}

export class FailEmbed extends EmbedBuilder {
  constructor(description: string) {
    super();
    this.setColor(GirColors.fail);
    this.setDescription(`${GirEmojis.fail} ${description}`);
  }
}

export class LoadingEmbed extends EmbedBuilder {
  constructor(description: string) {
    super();
    this.setColor(GirColors.default);
    this.setAuthor({ name: pickRandom(RandomLoadingMessage) });
    this.setDescription(`${GirEmojis.loading} ${description}`);
  }
}

export class DefaultEmbed extends EmbedBuilder {
  constructor(description: string) {
    super();
    this.setColor(GirColors.default);
    this.setDescription(`${description}`);
  }
}
