import { Token } from '#config';
import { GirClient } from '#lib/GirClient';
import { container } from '@sapphire/framework';

const client = new GirClient();

async function main() {
  try {
    await client.login(Token);
  } catch (err) {
    container.logger.error(err);
    client.destroy();
    process.exit(1);
  }
}

main().catch(container.logger.error.bind(container.logger));
