import { ClientConfig, MongoURI } from '#config';
import { SapphireClient } from '@sapphire/framework';
import '@sapphire/plugin-logger/register';
import '@sapphire/plugin-subcommands/register';
import type { Utils } from './structures';
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
}

declare module '@sapphire/pieces' {
  interface Container {
    utils: Utils;
  }
}
