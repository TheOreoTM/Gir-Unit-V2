import { GirCommand } from '#lib/structures';
import messageSchema from '#lib/structures/schemas/message-schema';
import { ApplyOptions } from '@sapphire/decorators';

@ApplyOptions<GirCommand.Options>({
  description: 'A basic command',
  name: 'statscheck',
  detailedDescription: {
    usages: ['description'],
    examples: ['xx xxx', 'yy yy'],
  },
})
export class statscheckCommand extends GirCommand {
  public async messageRun(message: GirCommand.Message) {
    const startMonth = 0; // January
    const endMonth = 4; // May
    const startYear = 2023;
    const endYear = 2023;
    const guildId = '519734247519420438';

    for (let month = startMonth; month <= endMonth; month++) {
      const startWeek = 1;
      const endWeek = 5;

      for (let week = startWeek; week <= endWeek; week++) {
        const startDate = new Date(
          Date.UTC(startYear, month, (week - 1) * 7 + 1)
        );
        const endDate = new Date(Date.UTC(startYear, month, week * 7 + 1));

        // Make sure the end date doesn't exceed the end of the month
        if (endDate > new Date(Date.UTC(endYear, month + 1, 1))) {
          endDate.setTime(
            new Date(Date.UTC(endYear, month + 1, 1)).getTime() - 1
          );
        }

        const count = await messageSchema.countDocuments({
          createdAt: { $gte: startDate, $lt: endDate },
          guildId,
        });

        message.channel.send(
          `Messages sent between ${startDate.toISOString()} and ${endDate.toISOString()}: ${count}`
        );
      }
    }
  }
}
