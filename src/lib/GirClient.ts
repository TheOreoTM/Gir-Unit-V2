import { ClientConfig, MongoURI } from '#config';
import { Prefix } from '#constants';
import {
  SapphireClient,
  SapphirePrefix,
  SapphirePrefixHook,
} from '@sapphire/framework';
import '@sapphire/plugin-logger/register';
import '@sapphire/plugin-subcommands/register';
import type { Message } from 'discord.js';
import type { Utils } from './structures';
import prefixSchema from './structures/schemas/prefix-schema';
import { connectToMongo } from './utility';

export class GirClient<
  Ready extends boolean = boolean
> extends SapphireClient<Ready> {
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

declare module '@sapphire/pieces' {
  interface Container {
    utils: Utils;
  }
}
