import { ClientConfig, MongoURI } from '#config';
import { Prefix } from '#constants';
import { Enumerable } from '@sapphire/decorators';
import {
  SapphireClient,
  SapphirePrefix,
  SapphirePrefixHook,
  container,
} from '@sapphire/framework';
import '@sapphire/plugin-logger/register';
import '@sapphire/plugin-subcommands/register';
import type { Message } from 'discord.js';
import mongoose from 'mongoose';
import prefixSchema from './structures/schemas/prefix-schema';
import type { LongLivingReactionCollector } from './utility/LongLivingReactionCollector';

export class GirClient<
  Ready extends boolean = boolean
> extends SapphireClient<Ready> {
  @Enumerable(false)
  public llrCollectors = new Set<LongLivingReactionCollector>();

  public constructor() {
    super(ClientConfig);
  }

  public override async login(token?: string): Promise<string> {
    await connectToMongo(MongoURI);
    return super.login(token);
  }
  public override destroy(): void {
    return super.destroy();
  }
  public override fetchPrefix: SapphirePrefixHook = async (
    message: Message
  ): Promise<SapphirePrefix> => {
    if (!message.guild) return Prefix;
    const serverPrefix = await prefixSchema.findOne({ _id: message.guild.id });
    if (!serverPrefix) return Prefix;
    return serverPrefix.prefix;
  };
}

async function connectToMongo(URI: string) {
  mongoose.set('strictQuery', true);
  await mongoose
    .connect(URI, {
      keepAlive: true,
    })
    .then(() => {
      container.logger.info('Mongoose connected!');
    })
    .catch((err) => {
      container.logger.fatal('Mongoose failed to connect', err);
    });
}
