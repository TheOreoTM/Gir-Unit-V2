import { Prefix } from '#constants';
import {
  FailEmbed,
  GirCommand,
  InfoEmbed,
  SuccessEmbed,
} from '#lib/structures';
import prefixSchema from '#lib/structures/schemas/prefix-schema';
import { ApplyOptions } from '@sapphire/decorators';
import { send } from '@sapphire/plugin-editable-commands';

@ApplyOptions<GirCommand.Options>({
  description: 'Change the prefix for the server',
  quotes: [
    ["'", "'"], // Single qoutes
    ['"', '"'], // Double quotes
    ['“', '”'], // Fancy quotes (on iOS)
    ['「', '」'], // Corner brackets (CJK)
    ['«', '»'], // French quotes (guillemets)
  ],
})
export class PrefixCommand extends GirCommand {
  public async messageRun(message: GirCommand.Message, args: GirCommand.Args) {
    let prefix = await args.pick('string').catch(() => null);
    if (!prefix) {
      const serverPrefix = await prefixSchema.findOne({ _id: message.guildId });
      let currentPrefix = Prefix;
      if (serverPrefix && serverPrefix.prefix) {
        currentPrefix = serverPrefix.prefix;
      }

      return await send(message, {
        embeds: [
          new InfoEmbed(`Current prefix of the server is ${currentPrefix}`),
        ],
      });
    }
    if (prefix.length > 7)
      return await send(message, {
        embeds: [new FailEmbed('Prefix length cannot be greater than 7')],
      });

    await prefixSchema.findOneAndUpdate(
      { _id: message.guildId },
      { prefix: prefix },
      { upsert: true }
    );

    return await send(message, {
      embeds: [
        new SuccessEmbed(
          `Successfully set \`${prefix}\` as the prefix for this server`
        ),
      ],
    });
  }
}
