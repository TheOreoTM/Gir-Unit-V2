import { ZeroWidthSpace } from '#constants';
import type { GirCommand } from '#lib/structures';
import { floatPromise, mins, resolveOnErrorCodes, sec } from '#lib/utility';
import { send } from '@sapphire/plugin-editable-commands';
import { RESTJSONErrorCodes } from 'discord-api-types/v9';
import type { Guild, Message, MessageCreateOptions } from 'discord.js';
import { setTimeout as sleep } from 'node:timers/promises';

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
  timer = sec(8)
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
  time = mins(1)
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
