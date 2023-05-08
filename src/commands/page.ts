import {
  DefaultEmbed,
  FailEmbed,
  GirCommand,
  GirPaginatedMessageEmbedFields,
  LoadingEmbed,
  SuccessEmbed,
} from '#lib/structures';
import { ApplyOptions } from '@sapphire/decorators';

@ApplyOptions<GirCommand.Options>({
  description: 'A basic command',
  name: 'page',
})
export class UserCommand extends GirCommand {
  public async messageRun(message: GirCommand.Message) {
    const embed = new GirPaginatedMessageEmbedFields()
      .addPageEmbed(new SuccessEmbed('test1'))
      .addPageEmbed(new FailEmbed('test2'))
      .addPageEmbed(new DefaultEmbed('test3'))
      .addPageEmbed(new LoadingEmbed('test4'));
    console.log(embed);
    await embed.run(message);
  }
}
