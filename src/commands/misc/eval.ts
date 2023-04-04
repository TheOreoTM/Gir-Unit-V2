import { Args, Command } from '@sapphire/framework';
import { send } from '@sapphire/plugin-editable-commands';
import { Type } from '@sapphire/type';
import { codeBlock, isThenable } from '@sapphire/utilities';
import type { Message } from 'discord.js';
import { inspect } from 'util';

export class UserCommand extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      aliases: ['ev'],
      description: 'Evals any JavaScript code',
      quotes: [],
      preconditions: ['OwnerOnly'],
      flags: ['async', 'hidden', 'showHidden', 'silent', 's'],
      options: ['depth'],
    });
  }

  public async messageRun(message: Message, args: Args) {
    const code = await args.rest('string');

    const { result, success, type } = await this.eval(code, {
      async: args.getFlags('async'),
      depth: Number(args.getOption('depth')) ?? 0,
      showHidden: args.getFlags('hidden', 'showHidden'),
    });

    const output = success
      ? codeBlock('js', result)
      : `**ERROR**: ${codeBlock('bash', result)}`;
    if (args.getFlags('silent', 's')) return null;

    const typeFooter = `**Type**: ${codeBlock('typescript', type)}`;

    if (output.length > 2000) {
      return send(message, {
        content: `Output was too long... sent the result as a file.\n\n${typeFooter}`,
        files: [{ attachment: Buffer.from(output), name: 'output.js' }],
      });
    }

    return send(message, `${output}\n${typeFooter}`);
  }

  private async eval(
    code: string,
    flags: { async: boolean; depth: number; showHidden: boolean }
  ) {
    if (flags.async) code = `(async () => {\n${code}\n})();`;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars

    let success = true;
    let result = null;

    try {
      // eslint-disable-next-line no-eval
      result = eval(code);
    } catch (error) {
      if (error && error instanceof Error && error.stack) {
        this.container.client.logger.error(error);
      }
      result = error;
      success = false;
    }

    const type = new Type(result).toString();
    if (isThenable(result)) result = await result;

    if (typeof result !== 'string') {
      result = inspect(result, {
        depth: flags.depth,
        showHidden: flags.showHidden,
      });
    }

    return { result, success, type };
  }
}
