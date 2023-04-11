import { Time } from '@sapphire/duration';
import { send, type MessageOptions } from '@sapphire/plugin-editable-commands';
import { sleep } from '@sapphire/utilities';
import { RESTJSONErrorCodes, type Message } from 'discord.js';
import { floatPromise, resolveOnErrorCodes } from '..';

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
  if (!message.deletable) return message;
  if (time === 0) return deleteMessageImmediately(message);

  const lastEditedTimestamp = message.editedTimestamp;
  await sleep(time);

  // If it was deleted or edited, cancel:
  if (!message.deletable || message.editedTimestamp !== lastEditedTimestamp) {
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
  options: string | MessageOptions,
  timer = Time.Second * 7
): Promise<Message> {
  if (typeof options === 'string') options = { content: options };

  const response = (await send(message, options)) as Message;
  floatPromise(deleteMessage(response, timer));
  return response;
}
