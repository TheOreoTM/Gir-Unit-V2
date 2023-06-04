import { FuzzySearch } from '#lib/structures';
import type { BannedWordData } from '#lib/types';
import { ApplyOptions } from '@sapphire/decorators';
import {
  InteractionHandler,
  InteractionHandlerTypes,
} from '@sapphire/framework';
import type {
  ApplicationCommandOptionChoiceData,
  AutocompleteInteraction,
} from 'discord.js';

@ApplyOptions<InteractionHandler.Options>({
  interactionHandlerType: InteractionHandlerTypes.Autocomplete,
})
export class AutocompleteHandler extends InteractionHandler {
  public override async run(
    interaction: AutocompleteInteraction,
    result: ApplicationCommandOptionChoiceData[]
  ) {
    return interaction.respond(result);
  }

  public override async parse(interaction: AutocompleteInteraction) {
    // Only run this interaction for the command with ID '1105914871230500964' (Automod)
    if (interaction.commandId !== '1105914871230500964') return this.none();
    // Get the focussed (current) option
    const focusedOption = interaction.options.getFocused(true);
    // Ensure that the option name is one that can be autocompleted, or return none if not.
    switch (focusedOption.name) {
      case 'remove': {
        const data = (await interaction.guild?.automod?.getSettings(
          'bannedWords'
        )) as BannedWordData;

        const bannedWords = data?.bannedWords ?? [];
        const words = Array.from(bannedWords.keys());

        const searchResult = new FuzzySearch(words).search(focusedOption.value);
        // Map the search results to the structure required for Autocomplete
        return this.some(
          searchResult.map((match) => ({
            name: match.target,
            value: match.target,
          }))
        );
      }
      default:
        return this.none();
    }
  }
}
