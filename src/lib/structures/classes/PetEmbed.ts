// import { PetUrl } from '#constants';
import { formatName, generateBar } from '#lib/utility';
import { EmbedBuilder } from 'discord.js';

export class PetEmbed extends EmbedBuilder {
  public constructor(pet: any) {
    console.log(pet);
    super();
    const stage = pet.stage || Math.ceil(pet.level / 20);
    const stageBar = generateBar(stage / 5);
    const name = formatName(pet, 'nlf');
    console.log(pet.petId);
    this.setTitle(name);
    this.addFields(
      {
        name: 'Details',
        value:
          `**XP:** ${pet.xp}/${pet.reqXp}\n` +
          `**Stage:** ${stage} | ${stageBar}`,
      },
      {
        name: `Stats`,
        value:
          `**HP:** ${pet.hpStat} – IV: ${pet.ivHp}/31\n` +
          `**Attack:** ${pet.atkStat} – IV: ${pet.ivAtk}/31\n` +
          `**Defense:** ${pet.defStat} – IV: ${pet.ivDef}/31\n` +
          `**Speed:** ${pet.spdStat} – IV: ${pet.ivSpd}/31\n` +
          `**Total IV:** ${pet.ivAverage}%`,
      }
    );
    this.setFooter({ text: `Displaying Pet ${pet.idx}\nID: ${pet._id}` });
    // this.setImage(`${PetUrl}${pet.petId.padStart(4, '0')}`);
  }
}
