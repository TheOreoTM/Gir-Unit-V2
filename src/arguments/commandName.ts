import { Owners } from '#constants';
import { FuzzySearch, GirCommand } from '#lib/structures';
import { PermissionLevels } from '#lib/types';
import { Argument, ArgumentContext } from '@sapphire/framework';

export class UserArgument extends Argument<GirCommand> {
  public async run(parameter: string, context: CommandArgumentContext) {
    const commands = this.container.stores.get('commands');
    const found = commands.get(parameter.toLowerCase()) as
      | GirCommand
      | undefined;
    if (found) {
      return this.isAllowed(found, context)
        ? this.ok(found)
        : this.error({
            parameter,
            identifier: 'InvalidCommand',
            message: `No command resolved for the search \`${parameter}\``,
            context,
          });
    }

    const searchResult = new FuzzySearch(
      commands.map((command) => {
        return command.name;
      })
    ).search(parameter);

    if (!searchResult || searchResult.length === 0)
      return this.error({
        parameter,
        identifier: 'InvalidCommand',
        message: `No command resolved for the search \`${parameter}\``,
        context,
      });

    const command = commands.find(
      (cmd) => cmd.name === searchResult[0].target
    ) as GirCommand | undefined;

    if (command) return this.ok(command);

    return this.error({
      parameter,
      identifier: 'InvalidCommand',
      message: `No command resolved for the search \`${parameter}\``,
      context,
    });
  }

  private isAllowed(
    command: GirCommand,
    context: CommandArgumentContext
  ): boolean {
    if (command.permissionLevel !== PermissionLevels.BotOwner) return true;
    return context.owners ?? Owners.includes(context.message.author.id);
  }
}

interface CommandArgumentContext extends ArgumentContext<GirCommand> {
  filter?: (entry: GirCommand) => boolean;
  owners?: boolean;
}
