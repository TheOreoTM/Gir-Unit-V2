import type { BasePetStat, PetStatType } from '#lib/types';
import { petData } from '#lib/utility/pet';
import { container } from '@sapphire/framework';
import type { User } from 'discord.js';
import petSchema from '../schemas/pet-schema';
import petUserSchema from '../schemas/petUser-schema';

const generateIv = () => {
  return container.utils.genRandomInt(0, 31) as number;
};

const calculateStat = (pet: Pet, stat: PetStatType): number => {
  let find: BasePetStat | undefined = petData.find((p) => p.id === pet.petId);
  if (!find) {
    return 0;
  }
  const base = find.baseStats[stat];
  let iv: number = 0;

  switch (stat) {
    case 'atk':
      iv = pet.ivAtk;
      break;
    case 'def':
      iv = pet.ivDef;
      break;
    case 'hp':
      iv = pet.ivHp;
      break;
    case 'spd':
      iv = pet.ivSpd;
      break;
  }

  return Math.round(((2 * base + iv + 5) * pet.level) / 100 + 5);
};

interface IPetData {
  owner: User;
  petId: string;
  shiny: boolean;
  name: string;
}

export class Pet {
  petId: string;
  ownerId: string;
  name: string;
  nickname: string;
  favourite: boolean;
  level: number;
  stage: number;
  xp: number;
  reqXp: number;
  ivTotal: number;
  ivAverage: number;
  shiny: boolean;
  ivHp: number = generateIv();
  ivAtk: number = generateIv();
  ivDef: number = generateIv();
  ivSpd: number = generateIv();
  hpStat = calculateStat(this, 'hp');
  defStat = calculateStat(this, 'def');
  atkStat = calculateStat(this, 'atk');
  spdStat = calculateStat(this, 'spd');
  moves: Array<any> = [];
  mega: object = {};
  idx: number = -1;
  constructor(data: IPetData, level?: number, xp?: number) {
    this.ownerId = data.owner.id;
    this.petId = data.petId;
    this.level = level ? level : 1;
    this.shiny = data.shiny ? data.shiny : false;
    this.name = data.name ? data.name : 'None';

    const reqXp = (this.level + 1) * 25 + 250;
    const stage = Math.ceil(this.level / 20);

    this.xp = xp ? xp : 0;
    this.reqXp = reqXp;
    this.stage = stage;

    this.nickname = '';
    this.favourite = false;

    this.ivTotal = this.ivHp + this.ivAtk + this.ivDef + this.ivSpd;
    this.ivAverage = parseFloat(((this.ivTotal / 124) * 100).toFixed(2));

    const mega = petData.find((pet) => pet.id === this.petId)!.mega ?? false;

    if (mega) {
      const megaTo = petData.find((pet) => pet.id === mega.id);
      this.mega = megaTo ?? {};
    } else {
      this.mega = {};
    }
  }

  public async generateIdx() {
    const data = await petUserSchema.findOneAndUpdate(
      { userId: this.ownerId },
      { $inc: { nextIdx: 1 } },
      { new: true, upsert: true }
    );
    this.idx = data.nextIdx;
  }

  public async create() {
    const data = await this.generateIdx();
    await petSchema.create(data);
  }
}
