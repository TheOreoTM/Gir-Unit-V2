import { Argument } from '@sapphire/framework';
import { ms } from 'enhanced-ms';

export class durationArgument extends Argument {
  public run(parameter: string, context: Argument.Context) {
    const duration = ms(parameter);

    if (!duration) {
      return this.error({
        parameter,
        identifier: 'InvalidDuration',
        message: 'Please provide a valid duration',
        context,
      });
    }

    if (typeof context.minimum === 'number' && duration < context.minimum) {
      return this.error({
        parameter,
        identifier: 'DurationTooSmall',
        message: `Duration should be greater than 0ms`,
        context,
      });
    }

    if (typeof context.maximum === 'number' && duration > context.maximum) {
      return this.error({
        parameter,
        identifier: 'DurationTooBig',
        message: `Duration should be less than ${ms(context.maximum)}`,
        context,
      });
    }

    return this.ok(duration);
  }
}
