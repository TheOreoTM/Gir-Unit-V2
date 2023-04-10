import { Args, Command } from '@sapphire/framework';
import { EmbedBuilder, Message } from 'discord.js';

export class UserCommand extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      aliases: ['ev'],
      description: 'Evals any JavaScript code',
      quotes: [],
      preconditions: ['BotOwner'],
      flags: ['async', 'hidden', 'showHidden', 'silent', 's'],
      options: ['depth'],
    });
  }

  public async messageRun(message: Message, args: Args) {
    const result = await args.rest('string');
    try {
      let noResultArg = new EmbedBuilder()
        .setColor('#e31212')
        .setDescription('ERROR: No valid eval args were provided');
      if (!result)
        return message.channel.send({
          embeds: [noResultArg],
        });
      let evaled = eval(result);
      const resultSuccess = new EmbedBuilder()
        .setColor('#8f82ff')
        .setTitle('Success')
        .addFields(
          {
            name: 'Input',
            value: '```ts\n' + `${result}` + '```',
            inline: false,
          } || undefined,
          {
            name: 'Output',
            value: '```ts\n' + `${evaled}` + '```',
            inline: false,
          } || undefined
        );
      await message.channel.send({
        embeds: [resultSuccess],
      });
      return;
    } catch (error) {
      const resultError =
        new EmbedBuilder()
          .setColor('#e31212')
          .setTitle('An error has occured')
          .setDescription(
            `**Output:**\n\`\`\`${error}\`\`\` \n  Input:\n\`\`\`js\n ${result} \`\`\` `
          ) || undefined;
      await message.channel.send({
        embeds: [resultError],
      });
      return;
    }
  }
}
