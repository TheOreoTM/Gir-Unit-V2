import { GirCommand } from '#lib/structures';
import { ApplyOptions } from '@sapphire/decorators';
import { send } from '@sapphire/plugin-editable-commands';

@ApplyOptions<GirCommand.Options>({
  description: 'A basic command',
  detailedDescription: {},
})
export class findcommandCommand extends GirCommand {
  public async messageRun(message: GirCommand.Message, args: GirCommand.Args) {
    const target = await args.pick('commandName');
    send(message, `\`\`\`json\n${JSON.stringify(target, null, 2)}\`\`\``);
  }
}
