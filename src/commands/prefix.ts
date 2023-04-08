import { FailEmbed, SuccessEmbed } from '#lib/structures';
import prefixSchema from '#lib/structures/schemas/prefix-schema';
import { ApplyOptions } from '@sapphire/decorators';
import { Args, Command } from '@sapphire/framework';
import { send } from '@sapphire/plugin-editable-commands';
import { Message, PermissionFlagsBits } from 'discord.js';

@ApplyOptions<Command.Options>({
  description: 'Sets the prefix for the server',
  name: 'prefix',
  requiredUserPermissions: [PermissionFlagsBits.ManageGuild],
})
export class UserCommand extends Command {
  public async messageRun(message: Message, args: Args) {
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

    return await send(message, {
      embeds: [
        new SuccessEmbed(
          `Successfully set \`${prefix}\` as the prefix for this server`
        ),
      ],
    });
  }
}
