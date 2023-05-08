import { GirCommand } from '#lib/structures';
import { capitalizeWords } from '#lib/utility';
import { ApplyOptions } from '@sapphire/decorators';
import { container } from '@sapphire/framework';
import { Collection } from 'discord.js';

@ApplyOptions<GirCommand.Options>({
  description: 'A basic command',
  name: 'help',
})
export class helpCommand extends GirCommand {
  public override async messageRun(
    message: GirCommand.Message,
    args: GirCommand.Args
  ) {
    const category = await args.pick('commandCategory');
    const commands = await helpCommand.fetchCommands();
    const commandInfo: string[] = [
      `**__Category: ${capitalizeWords(category)}__**`,
    ];

    commands.forEach((commandArray, commandCategory) => {
      if (commandCategory.toLowerCase() !== category.toLowerCase()) return;

      commandArray.forEach((command) => {
        if (command.hidden) return;
        commandInfo.push(
          `Command name: ${command.name}\nCommand description: ${
            command.description
          }\nCommand usage: ${command.detailedDescription.usage ?? 'None'}\n`
        );
      });
    });

    message.channel.send(commandInfo.join('\n\n'));
  }

  private static async fetchCommands() {
    const commands = container.stores.get('commands');
    const filtered = new Collection<string, GirCommand[]>();
    await Promise.all(
      commands.map(async (cmd) => {
        const command = cmd as GirCommand;
        if (command.hidden) return;

        const category = filtered.get(command.fullCategory!.join(' → '));
        if (category) category.push(command);
        else
          filtered.set(command.fullCategory!.join(' → '), [
            command as GirCommand,
          ]);
      })
    );

    return filtered;
  }
}
