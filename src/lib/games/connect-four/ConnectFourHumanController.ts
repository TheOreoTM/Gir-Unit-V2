import { cast } from '@sapphire/utilities';
import { BaseReactionController } from '../base/BaseReactionController';
import type { ConnectFourGame } from './ConnectFourGame';

export class ConnectFourHumanController extends BaseReactionController<number> {
  public async await(): Promise<number> {
    const reaction = await this.collectAvailableReaction();
    if (reaction === null) return -1;

    const game = cast<ConnectFourGame>(this.game);
    return game.reactions.indexOf(reaction);
  }

  protected resolveCollectedValidity(collected: string): boolean {
    const game = cast<ConnectFourGame>(this.game);
    const index = game.reactions.indexOf(collected);
    return index !== -1 && game.remaining[index] > 0;
  }
}
