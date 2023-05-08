import { PetShinyChance } from '#constants';
import { GirCommand, Pet } from '#lib/structures';
import { genRandomFloat } from '#lib/utility';
import { PetArray } from '#lib/utility/pet';
import { ApplyOptions } from '@sapphire/decorators';
import { send } from '@sapphire/plugin-editable-commands';
import { pickRandom } from '@sapphire/utilities';

@ApplyOptions<GirCommand.Options>({
  description: 'Adopt a pet',
  name: 'adopt',
})
export class petCommand extends GirCommand {
  public override async messageRun(
    message: GirCommand.Message,
    args: GirCommand.Args
  ) {
    const target = await args.pick('member').catch(() => message.member);
    const data = pickRandom(PetArray);

    const pet = new Pet({
      name: data.name,
      owner: target,
      shiny: genRandomFloat(0, 1) <= PetShinyChance,
      petId: data.id,
    });
    await pet.create();
    send(
      message,
      `adopt these nuts ${target}\n\`\`\`json\n${JSON.stringify(
        pet,
        null,
        2
      )}\`\`\``
    );
  }
}
