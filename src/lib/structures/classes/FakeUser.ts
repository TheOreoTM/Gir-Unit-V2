import { User } from 'discord.js';

class FakeAvatar {
  url: string = 'https://cdn.discordapp.com/embed/avatars/0.png';
  public constructor(url?: string) {
    this.url = url ? url : 'https://cdn.discordapp.com/embed/avatars/0.png';
  }
}

export class FakeUser extends User {
  public displayAvatarUrl() {
    return new FakeAvatar();
  }

  public get tag() {
    return `${this.id}#${this.discriminator}`;
  }

  // Alternatively, define `id` as a property instead of an accessor
  public id = '0000000000000000';

  // Add any additional methods or properties needed for testing
  // For example:
  public username = 'Dummy';

  public discriminator = '0000';
}
