import { FailEmbed, GirCommand, SuccessEmbed } from '#lib/structures';
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
    let prefix = await args.pick('string');
    if (prefix.length > 7)
      return await send(message, {
        embeds: [new FailEmbed('Prefix length cannot be greater than 7')],
      });

    await prefixSchema.findOneAndUpdate(
      { _id: message.guildId },
      { prefix: prefix },
      { upsert: true }
    );

    console.log(await message.guild.logging?.moderation);

    return await send(message, {
      embeds: [
        new SuccessEmbed(
          `Successfully set \`${prefix}\` as the prefix for this server`
        ),
      ],
    });
  }
}
