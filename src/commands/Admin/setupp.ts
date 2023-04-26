import { GirColors, GirEmojis } from '#constants';
import { Button, Embed, GirCommand, Row } from '#lib/structures';
import { mins } from '#lib/utility';
import { ApplyOptions } from '@sapphire/decorators';
import { send, track } from '@sapphire/plugin-editable-commands';
import {
  ButtonInteraction,
  ButtonStyle,
  ComponentType,
  Message,
  RoleSelectMenuBuilder,
} from 'discord.js';

@ApplyOptions<GirCommand.Options>({
  description: 'A basic command',
  name: 'setupp',
})
export class setuppCommand extends GirCommand {
  public override async messageRun(message: GirCommand.Message) {
    let stage = 0;
    let setupMessage = await send(message, {
      embeds: [this.welcome()],
      components: [
        new Row<Button>()._components([
          new Button() //
            ._customId('not-ready')
            ._label('I am not ready')
            ._style(ButtonStyle.Secondary)
            ._emoji(GirEmojis.Fail),
          new Button() //
            ._customId('start')
            ._label("Let's get started!")
            ._style(ButtonStyle.Secondary)
            ._emoji(GirEmojis.Success),
        ]),
      ],
    });

    track(message, setupMessage);
    const collector = setupMessage.createMessageComponentCollector({
      time: mins(3),
      componentType: ComponentType.Button,
    });

    // --------------------------------------
    // const traineeRoles: string[] = [];
    // const staffRoles: string[] = [];
    // const modRoles: string[] = [];
    // const adminRoles: string[] = [];
    // let modLogChannel: TextChannel | undefined;
    //

    collector.on('collect', async (i) => {
      if (i.user.id !== message.author.id) {
        await i.followUp({
          content: `This isn't for you.`,
          ephemeral: true,
        });
        return;
      }
      switch (i.customId) {
        case 'not-ready':
          await i.update({
            content: `Setup process cancelled`,
            embeds: [],
            components: [],
          });
          collector.stop('not-ready');
          return;

        case 'start':
          collector.resetTimer();
          stage = 1;
          await this.step1(i, setupMessage, stage);
          break;

        case 'add_modroles':
          collector.resetTimer();
          console.log(i);
      }
    });
  }

  private welcome() {
    return new Embed()
      ._color(GirColors.Default)
      ._thumbnail(this.container.client.user?.displayAvatarURL() ?? '')
      ._timestamp()
      ._title('Welcome to Gir-Unit!')
      ._description(
        `This is the setup wizard for Gir-Unit.\nThis will guide you through the process of setting up Gir-Unit.`
      );
  }

  private async step1(
    i: ButtonInteraction,
    prevMessage: Message,
    _stage: number
  ) {
    const embed = new Embed(prevMessage.embeds[0].data)._fields([
      {
        name: `What are the roles? [Min: 1, Max: 3]`,
        value:
          `Please pick the roles from the select menus below.\n` +
          `When done, press the button to confirm, else press retry`,
      },
      {
        name: 'Roles Entered',
        value: 'None',
      },
    ]);
    return i.update({
      embeds: [embed],
      components: [
        new Row<RoleSelectMenuBuilder>()._components([
          new RoleSelectMenuBuilder()
            .setCustomId('add_traineeroles')
            .setMaxValues(3)
            .setMinValues(1)
            .setPlaceholder('Select trainee roles'),
        ]),
        new Row<RoleSelectMenuBuilder>()._components([
          new RoleSelectMenuBuilder()
            .setCustomId('add_staffroles')
            .setMaxValues(3)
            .setMinValues(1)
            .setPlaceholder('Select staff roles'),
        ]),
        new Row<RoleSelectMenuBuilder>()._components([
          new RoleSelectMenuBuilder()
            .setCustomId('add_modroles')
            .setMaxValues(3)
            .setMinValues(1)
            .setPlaceholder('Select moderator roles'),
        ]),
        new Row<RoleSelectMenuBuilder>()._components([
          new RoleSelectMenuBuilder()
            .setCustomId('add_adminroles')
            .setMaxValues(2)
            .setMinValues(1)
            .setPlaceholder('Select admin roles'),
        ]),
        new Row<Button>()._components([
          new Button()
            ._customId('retry_mod')
            ._label('Retry')
            ._style(ButtonStyle.Secondary),
          new Button()
            ._customId('confirm_modRoles')
            ._label('Confirm')
            ._style(ButtonStyle.Success),
        ]),
      ],
      fetchReply: true,
    }) as Promise<Message>;
  }
}
