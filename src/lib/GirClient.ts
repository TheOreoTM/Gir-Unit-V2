import { ClientConfig, MongoURI, Prefix } from '#config';
import prefixSchema from '#lib/structures/schemas/prefix-schema';
import { SapphireClient } from '@sapphire/framework';
import type { Message } from 'discord.js';
import mongoose from 'mongoose';
import type { Utils } from './structures';

export class GirClient<
  Ready extends boolean = boolean
> extends SapphireClient<Ready> {
  public constructor() {
    super(ClientConfig);
  }
  public override async login(token?: string): Promise<string> {
    await mongoose.connect(`${MongoURI}`);
    return super.login(token);
  }
  public override destroy(): void {
    return super.destroy();
  }

  public override fetchPrefix = async (message: Message) => {
    if (!message.guild) return Prefix;

    const guild = await prefixSchema.findOne({ _id: message.guild.id });

    return guild?.prefix ?? Prefix;
  };
}

declare module '@sapphire/pieces' {
  interface Container {
    utils: Utils;
  }
}
