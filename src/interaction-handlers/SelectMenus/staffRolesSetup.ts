import { ApplyOptions } from '@sapphire/decorators';
import {
  InteractionHandler,
  InteractionHandlerTypes,
} from '@sapphire/framework';
import type { RoleSelectMenuInteraction } from 'discord.js';

@ApplyOptions<InteractionHandler.Options>({
  interactionHandlerType: InteractionHandlerTypes.SelectMenu,
})
export class MenuHandler extends InteractionHandler {
  public override async run(interaction: RoleSelectMenuInteraction) {
    interaction.message.embeds[0].data.fields![1].value = `<@&${interaction.values.join(
      '> <@&'
    )}>`;
    await interaction.message.edit({
      // Remember how we can have multiple values? Let's get the first one!
      embeds: interaction.message.embeds,
    });
  }

  public override parse(interaction: RoleSelectMenuInteraction) {
    if (
      interaction.customId.startsWith('add_') &&
      interaction.customId.endsWith('roles')
    )
      return this.some();

    return this.none();
  }
}
