import type { GirClient } from '#lib/GirClient';

export async function mention(command: string, client: GirClient) {
  const commands = await (await client.application?.fetch())?.commands.fetch();

  if (!commands) throw new Error('Failed to fetch commands!');

  const commandNames = command.split(' ');

  const slash = commands.find((c) => c.name === commandNames[0]);

  if (!slash) return `/${command}`;

  return `</${command}:${slash.id}>`;
}
