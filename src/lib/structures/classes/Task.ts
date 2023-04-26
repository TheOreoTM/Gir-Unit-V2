import { container } from '@sapphire/framework';
import Cron from 'croner';
import type { Client } from 'discord.js';

export class Task {
  public pattern: string = '*/5 * * * * *';
  public enabled: boolean = true;
  public client: Client = container.client;
  public cron: Cron;

  constructor() {
    this.cron = Cron(this.pattern, () => {
      this.run(this.client);
    });
  }

  public stop(): void;
  public stop() {
    return this.cron.stop();
  }

  public async run(client: Client): Promise<void>;
  public async run() {}
}
