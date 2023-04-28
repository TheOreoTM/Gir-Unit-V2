import { GirColors, GirEmojis, RandomLoadingMessage } from '#constants';
import { pickRandom } from '#lib/utility';
import { EmbedBuilder } from 'discord.js';

export class SuccessEmbed extends EmbedBuilder {
  constructor(description: string) {
    super();
    this.setColor(GirColors.Success);
    this.setDescription(`***${GirEmojis.Success} ${description}***`);
  }
}

export class FailEmbed extends EmbedBuilder {
  constructor(description: string) {
    super();
    this.setColor(GirColors.Fail);
    this.setDescription(`${GirEmojis.Fail} ${description}`);
  }
}

export class LoadingEmbed extends EmbedBuilder {
  constructor(description: string) {
    super();
    this.setColor(GirColors.Default);
    this.setAuthor({ name: pickRandom(RandomLoadingMessage) });
    this.setDescription(`${GirEmojis.Loading} ${description}`);
  }
}

export class DefaultEmbed extends EmbedBuilder {
  constructor(description: string) {
    super();
    this.setColor(GirColors.Default);
    this.setDescription(`${description}`);
  }
}

export class InfoEmbed extends EmbedBuilder {
  constructor(description: string) {
    super();
    this.setColor(GirColors.Default);
    this.setDescription(`${GirEmojis.Info} ${description}`);
  }
}
