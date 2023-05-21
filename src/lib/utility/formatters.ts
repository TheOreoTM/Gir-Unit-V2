import type { GuildMessage } from '#lib/types';
import type {
  APIEmbedField,
  Attachment,
  Embed,
  EmbedFooterData,
  EmbedImageData,
  Guild,
  User,
} from 'discord.js';
import { cleanMentions } from './functions';

export function formatMessage(message: GuildMessage): string {
  const header = formatHeader(message);
  const content = formatContents(message);
  return `${header}\n${content}`;
}

function formatHeader(message: GuildMessage): string {
  return `${formatTimestamp(message.createdTimestamp)} ${
    message.system ? 'SYSTEM' : formatAuthor(message.author)
  }`;
}

/**
 * Formats a timestamp using {@link Intl}
 *
 * This **cannot** make use of Discord's timestamp formatting as the result
 * of this function is placed inside of a codeblock.
 */
function formatTimestamp(timestamp: number): string {
  return `[${timestamp}]`;
}

function formatAuthor(author: User): string {
  return `${author.tag}${author.bot ? ' [BOT]' : ''}`;
}

function formatContents(message: GuildMessage): string {
  const output: string[] = [];
  if (message.content.length > 0)
    output.push(formatContent(message.guild, message.content));
  if (message.embeds.length > 0)
    output.push(
      message.embeds
        .map((embed) => formatEmbed(message.guild, embed))
        .join('\n')
    );
  if (message.attachments.size > 0)
    output.push(
      message.attachments
        .map((attachment) => formatAttachment(attachment))
        .join('\n')
    );
  return output.join('\n');
}

function formatContent(guild: Guild, content: string): string {
  return cleanMentions(guild, content)
    .split('\n')
    .map((line) => `> ${line}`)
    .join('\n');
}

export function formatAttachment(attachment: Attachment): string {
  return `📂 [${attachment.name}: ${attachment.url}]`;
}

function formatEmbed(guild: Guild, embed: Embed): string {
  if (embed.video) return formatEmbedVideo(embed);
  if (embed.image) return formatEmbedImage(embed);
  return formatEmbedRich(guild, embed);
}

function formatEmbedVideo(embed: Embed): string {
  return `📹 [${embed.url}]${
    embed.provider ? ` (${embed.provider.name}).` : ''
  }`;
}

function formatEmbedImage(embed: Embed): string {
  return `🖼️ [${embed.url}]${
    embed.provider ? ` (${embed.provider.name}).` : ''
  }`;
}

function formatEmbedRich(guild: Guild, embed: Embed): string {
  if (embed.provider === null) {
    const output: string[] = [];
    if (embed.title) output.push(formatEmbedRichTitle(embed.title));
    if (embed.author) output.push(formatEmbedRichAuthor(embed.author));
    if (embed.url) output.push(formatEmbedRichUrl(embed.url));
    if (embed.description)
      output.push(formatEmbedRichDescription(guild, embed.description));
    if (embed.fields.length > 0)
      output.push(
        embed.fields
          .map((field) => formatEmbedRichField(guild, field))
          .join('\n')
      );
    if (embed.image) output.push(formatEmbedRichImage(embed.image));
    if (embed.footer) output.push(formatEmbedRichFooter(embed.footer));
    return output.join('\n');
  }

  return formatEmbedRichProvider(embed);
}

function formatEmbedRichTitle(title: string): string {
  return `># ${title}`;
}

function formatEmbedRichUrl(url: string): string {
  return `> 📎 ${url}`;
}

function formatEmbedRichAuthor(author: Exclude<Embed['author'], null>): string {
  return `> 👤 ${author.iconURL ? `[${author.iconURL}] ` : ''}${
    author.name || '-'
  }${author.url ? ` <${author.url}>` : ''}`;
}

function formatEmbedRichDescription(guild: Guild, description: string): string {
  return cleanMentions(guild, description)
    .split('\n')
    .map((line) => `> > ${line}`)
    .join('\n');
}

function formatEmbedRichField(guild: Guild, field: APIEmbedField): string {
  return `> #> ${field.name}\n${cleanMentions(guild, field.value)
    .split('\n')
    .map((line) => `>  > ${line}`)
    .join('\n')}`;
}

function formatEmbedRichImage(image: EmbedImageData): string {
  return `>🖼️ [${image.url}]`;
}

function formatEmbedRichFooter(footer: EmbedFooterData): string {
  return `>_ ${
    footer.iconURL ? `[${footer.iconURL}]${footer.text ? ' - ' : ''}` : ''
  }${footer.text ?? ''}`;
}

function formatEmbedRichProvider(embed: Embed): string {
  return `🔖 [${embed.url}]${
    embed.provider ? ` (${embed.provider.name}).` : ''
  }`;
}
