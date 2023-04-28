import { container } from '@sapphire/framework';
import Cron from 'croner';
import type { Client } from 'discord.js';

export class Task {
  private readonly pattern: string = '*/3 * * * * *';
  private readonly enabled: boolean = true;
  public client: Client = container.client;
  public cron: Cron;

  constructor() {
    if (this.enabled) {
    }
    this.cron = Cron(this.pattern, () => {
      this.run(this.client);
    });
  }

  public stop(): void;
  public stop() {
    return this.cron.stop();
  }

  public async run(client: Client) {
    client;
  }
}
