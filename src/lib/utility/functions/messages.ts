import { GirColors, ZeroWidthSpace } from '#constants';
import type { GirCommand } from '#lib/structures';
import {
  floatPromise,
  minutes,
  resolveOnErrorCodes,
  seconds,
} from '#lib/utility';
import { send } from '@sapphire/plugin-editable-commands';
import { RESTJSONErrorCodes } from 'discord-api-types/v9';
import {
  Guild,
  Message,
  MessageCreateOptions,
  PermissionFlagsBits,
} from 'discord.js';
import { setTimeout as sleep } from 'node:timers/promises';

import { isNullishOrEmpty, Nullish, tryParseURL } from '@sapphire/utilities';
import { loadImage, type Image } from 'canvas-constructor/napi-rs';
import type { APIUser } from 'discord-api-types/v9';
import type {
  GuildChannel,
  ImageSize,
  ImageURLOptions,
  MessageMentionTypes,
  ThreadChannel,
  User,
  UserResolvable,
} from 'discord.js';

const messageCommands = new WeakMap<Message, GirCommand>();

/**
 * Sets or resets the tracking status of a message with a command.
 * @param message The message to track.
 * @param command The command that was run with the given message, if any.
 */
export function setCommand(message: Message, command: GirCommand | null) {
  if (command === null) messageCommands.delete(message);
  else messageCommands.set(message, command);
}

/**
 * Gets the tracked command from a message.
 * @param message The message to get the command from.
 * @returns The command that was run with the given message, if any.
 */
export function getCommand(message: Message): GirCommand | null {
  return messageCommands.get(message) ?? null;
}

async function deleteMessageImmediately(message: Message): Promise<Message> {
  return (
    (await resolveOnErrorCodes(
      message.delete(),
      RESTJSONErrorCodes.UnknownMessage
    )) ?? message
  );
}

/**
 * Deletes a message, skipping if it was already deleted, and aborting if a non-zero timer was set and the message was
 * either deleted or edited.
 *
 * This also ignores the `UnknownMessage` error code.
 * @param message The message to delete.
 * @param time The amount of time, defaults to 0.
 * @returns The deleted message.
 */
export async function deleteMessage(
  message: Message,
  time = 0
): Promise<Message> {
  if (!message) return message;
  if (time === 0) return deleteMessageImmediately(message);

  const lastEditedTimestamp = message.editedTimestamp;
  await sleep(time);

  // If it was deleted or edited, cancel:
  if (!message || message.editedTimestamp !== lastEditedTimestamp) {
    return message;
  }

  return deleteMessageImmediately(message);
}

/**
 * Sends a temporary editable message and then floats a {@link deleteMessage} with the given `timer`.
 * @param message The message to reply to.
 * @param options The options to be sent to the channel.
 * @param timer The timer in which the message should be deleted, using {@link deleteMessage}.
 * @returns The response message.
 */
export async function sendTemporaryMessage(
  message: Message,
  options: string | MessageCreateOptions,
  timer = seconds(8)
): Promise<Message> {
  if (typeof options === 'string') options = { content: options };

  const response = (await send(message, options)) as Message;
  // floatPromise(deleteMessage(response, timer)); // No need for this because when message gets deleted so does the command reponse
  floatPromise(deleteMessage(response, timer));
  return response;
}

/**
 * Sends a boolean confirmation prompt asking the `target` for either of two choices.
 * @param message The message to ask for a confirmation from.
 * @param options The options for the message to be sent, alongside the prompt options.
 * @returns `null` if no response was given within the requested time, `boolean` otherwise.
 */

export async function promptForMessage(
  message: Message,
  sendOptions: string | MessageCreateOptions,
  time = minutes(1)
): Promise<string | null> {
  const response = await message.channel.send(sendOptions);
  const responses = await message.channel.awaitMessages({
    filter: (msg) => msg.author === message.author,
    time,
    max: 1,
  });
  floatPromise(deleteMessage(response));

  return responses.size === 0 ? null : responses.first()!.content;
}

/**
 * Image extensions:
 * - bmp
 * - jpg
 * - jpeg
 * - png
 * - gif
 * - webp
 */
export const IMAGE_EXTENSION = /\.(bmp|jpe?g|png|gif|webp)$/i;

/**
 * Media extensions
 * - ...Image extensions
 * - ...Audio extensions
 * - ...Video extensions
 */
export const MEDIA_EXTENSION =
  /\.(bmp|jpe?g|png|gifv?|web[pm]|wav|mp[34]|ogg)$/i;

export function radians(degrees: number) {
  return (degrees * Math.PI) / 180;
}

export function fetchAvatar(user: User, size: ImageSize = 512): Promise<Image> {
  const url = user.avatar
    ? user.avatarURL({ extension: 'png', size })!
    : user.defaultAvatarURL;
  return loadImage(url);
}

/**
 * Get the content from a message.
 * @param message The Message instance to get the content from
 */
export function getContent(message: Message): string | null {
  if (message.content) return message.content;
  for (const embed of message.embeds) {
    if (embed.description) return embed.description;
    if (embed.fields.length) return embed.fields[0].value;
  }
  return null;
}

export interface ImageAttachment {
  url: string;
  proxyURL: string;
  height: number;
  width: number;
}

/**
 * Get a image attachment from a message.
 * @param message The Message instance to get the image url from
 */
export function getAttachment(message: Message): ImageAttachment | null {
  if (message.attachments.size) {
    const attachment = message.attachments.find((att) =>
      IMAGE_EXTENSION.test(att.url)
    );
    if (attachment) {
      return {
        url: attachment.url,
        proxyURL: attachment.proxyURL,
        height: attachment.height!,
        width: attachment.width!,
      };
    }
  }

  for (const embed of message.embeds) {
    if (embed.thumbnail) {
      return {
        url: embed.thumbnail!.url,
        proxyURL: embed.thumbnail!.proxyURL!,
        height: embed.thumbnail!.height!,
        width: embed.thumbnail!.width!,
      };
    }
    if (embed.image) {
      return {
        url: embed.image.url,
        proxyURL: embed.image.proxyURL!,
        height: embed.image.height!,
        width: embed.image.width!,
      };
    }
  }

  return null;
}

/**
 * Get the image url from a message.
 * @param message The Message instance to get the image url from
 */
export function getImage(message: Message): string | null {
  const attachment = getAttachment(message);
  return attachment ? attachment.proxyURL || attachment.url : null;
}

const ROOT = 'https://cdn.discordapp.com';
export function getDisplayAvatar(
  id: string,
  user: User | APIUser,
  options: ImageURLOptions = {}
) {
  if (user.avatar === null)
    return `${ROOT}/embed/avatars/${Number(user.discriminator) % 5}.png`;
  const format =
    typeof options.extension === 'undefined'
      ? user.avatar.startsWith('a_')
        ? 'gif'
        : 'png'
      : options.extension;
  const size =
    typeof options.size === 'undefined' ? '' : `?size=${options.size}`;
  return `${ROOT}/avatars/${id}/${user.avatar}.${format}${size}`;
}

/**
 * Parse a range
 * @param input The input to parse
 * @example
 * parseRange('23..25');
 * // -> [23, 24, 25]
 * @example
 * parseRange('1..3,23..25');
 * // -> [1, 2, 3, 23, 24, 25]
 */
export function parseRange(input: string): number[] {
  const set = new Set<number>();
  for (const subset of input.split(',')) {
    const [, stringMin, stringMax] = /(\d+) *\.{2,} *(\d+)/.exec(subset) || [
      subset,
      subset,
      subset,
    ];
    let min = Number(stringMin);
    let max = Number(stringMax);
    if (min > max) [max, min] = [min, max];

    for (let i = Math.max(1, min); i <= max; ++i) set.add(i);
  }

  return [...set];
}

/**
 * Parses an URL and checks if the extension is valid.
 * @param url The url to check
 */
export function getImageUrl(url: string): string | undefined {
  const parsed = tryParseURL(url);
  return parsed && IMAGE_EXTENSION.test(parsed.pathname)
    ? parsed.href
    : undefined;
}

/**
 * Clean all mentions from a body of text
 * @param guild The guild for context
 * @param input The input to clean
 * @returns The input cleaned of mentions
 * @license Apache-2.0
 * @copyright 2019 Aura Román
 */
export function cleanMentions(guild: Guild, input: string) {
  return input
    .replace(/@(here|everyone)/g, `@${ZeroWidthSpace}$1`)
    .replace(/<(@[!&]?|#)(\d{17,19})>/g, (match, type, id) => {
      switch (type) {
        case '@':
        case '@!': {
          const tag = guild.client.users.cache.get(id);
          return tag ? `@${tag.username}` : `<${type}${ZeroWidthSpace}${id}>`;
        }
        case '@&': {
          const role = guild.roles.cache.get(id);
          return role ? `@${role.name}` : match;
        }
        case '#': {
          const channel = guild.channels.cache.get(id);
          return channel
            ? `#${channel.name}`
            : `<${type}${ZeroWidthSpace}${id}>`;
        }
        default:
          return `<${type}${ZeroWidthSpace}${id}>`;
      }
    });
}

export const anyMentionRegExp = /<(@[!&]?|#)(\d{17,19})>/g;
export const hereOrEveryoneMentionRegExp = /@(?:here|everyone)/;

/**
 * Extracts mentions from a body of text.
 * @remark Preserves the mentions in the content, if you want to remove them use `cleanMentions`.
 * @param input The input to extract mentions from.
 */
export function extractDetailedMentions(
  input: string | Nullish
): DetailedMentionExtractionResult {
  const users = new Set<string>();
  const roles = new Set<string>();
  const channels = new Set<string>();
  const parse = [] as MessageMentionTypes[];

  if (isNullishOrEmpty(input)) {
    return { users, roles, channels, parse };
  }

  let result: RegExpExecArray | null;
  while ((result = anyMentionRegExp.exec(input)) !== null) {
    switch (result[1]) {
      case '@':
      case '@!': {
        users.add(result[2]);
        continue;
      }
      case '@&': {
        roles.add(result[2]);
        continue;
      }
      case '#': {
        channels.add(result[2]);
        continue;
      }
    }
  }

  if (hereOrEveryoneMentionRegExp.test(input)) parse.push('everyone');

  return { users, roles, channels, parse };
}

export interface DetailedMentionExtractionResult {
  users: ReadonlySet<string>;
  roles: ReadonlySet<string>;
  channels: ReadonlySet<string>;
  parse: MessageMentionTypes[];
}

export function cast<T>(value: unknown): T {
  return value as T;
}

/**
 * Validates that a user has VIEW_CHANNEL permissions to a channel
 * @param channel The TextChannel to check
 * @param user The user for which to check permission
 * @returns Whether the user has access to the channel
 * @example validateChannelAccess(channel, message.author)
 */
export function validateChannelAccess(
  channel: GuildChannel | ThreadChannel,
  user: UserResolvable
) {
  return (
    (channel.guild !== null &&
      channel.permissionsFor(user)?.has(PermissionFlagsBits.ViewChannel)) ||
    false
  );
}

/**
 * Shuffles an array, returning it
 * @param array The array to shuffle
 */
export const shuffle = <T>(array: T[]): T[] => {
  let m = array.length;
  while (m) {
    const i = Math.floor(Math.random() * m--);
    [array[m], array[i]] = [array[i], array[m]];
  }
  return array;
};

export const random = (num: number) => Math.floor(Math.random() * num);

export function getColor(message: Message) {
  return message.member?.displayColor ?? GirColors.Default;
}
