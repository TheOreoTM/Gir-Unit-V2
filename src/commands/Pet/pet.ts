import { FailEmbed, GirCommand, Pet, PetEmbed } from '#lib/structures';
import petSchema from '#lib/structures/schemas/pet-schema';
import petUserSchema from '#lib/structures/schemas/petUser-schema';

import { ApplyOptions } from '@sapphire/decorators';
import { send } from '@sapphire/plugin-editable-commands';

@ApplyOptions<GirCommand.Options>({
  description: 'View your pet',
  name: 'pet',
})
export class petCommand extends GirCommand {
  public override async messageRun(
    message: GirCommand.Message,
    args: GirCommand.Args
  ) {
    const prefix = await this.prefix(message);
    const target = message.member;
    const data = await petUserSchema.findOne({ userId: target.id });
    let petId = await args.pick('number').catch(() => null);
    let selectedPet: any = null;
    console.log(selectedPet, petId);

    if (!data) {
      return send(message, {
        embeds: [
          new FailEmbed(
            `Adopt a pet in order to begin using the \`${prefix}adopt\` command`
          ),
        ],
      });
    }

    if (!data.selectedId && !petId) {
      return send(message, {
        embeds: [
          new FailEmbed(
            `You dont have a pet selected. Select one using \`${prefix}select\` command`
          ),
        ],
      });
    }

    if (data && data.selectedId) {
      console.log(data.selectedId);
      selectedPet = await petSchema.findOne({ _id: data.selectedId });

      console.log(selectedPet, 'lol');
    }

    if (petId) {
      const pet: Pet | null =
        (await petSchema.findOne({ ownerId: target.id, idx: petId })) ?? null;
      if (!pet) {
        return await send(message, {
          embeds: [new FailEmbed(`Couldn't find that pet`)],
        });
      }
      console.log(pet);

      selectedPet = pet;
    }

    if (!selectedPet) {
      return send(message, {
        embeds: [new FailEmbed(`I couldn't find that pet`)],
      });
    }

    console.log(petId, selectedPet);
    const embed = new PetEmbed(selectedPet);

    return await send(message, { embeds: [embed] });
  }
}
