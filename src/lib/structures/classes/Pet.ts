import type { BasePetStat, PetStatType } from '#lib/types';
import { capitalizeWords, genRandomInt } from '#lib/utility';
import { PetData } from '#lib/utility/pet';
import type { GuildMember } from 'discord.js';
import type { Types } from 'mongoose';
import petSchema from '../schemas/pet-schema';
import petUserSchema from '../schemas/petUser-schema';

const generateIv = () => {
  return genRandomInt(0, 31) as number;
};

const calculateStat = (pet: Pet, stat: PetStatType): number => {
  let find: BasePetStat | undefined = PetData.get(pet.petId);
  if (!find) {
    console.log(pet.petId);
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
  owner: GuildMember;
  petId: string;
  shiny: boolean;
  name: string;
}

export class Pet {
  _id?: Types.ObjectId;
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
  hpStat: number;
  defStat: number;
  atkStat: number;
  spdStat: number;
  moves: Array<any> = [];
  mega?: { id: string; requirement: string };
  idx: number = -1;
  constructor(data: IPetData, level?: number, xp?: number) {
    this.ownerId = data.owner.id;
    this.petId = data.petId;
    this.level = level ? level : 1;
    this.shiny = data.shiny ? data.shiny : false;
    this.name = data.name ? capitalizeWords(data.name) : 'None';

    const reqXp = (this.level + 1) * 25 + 250;
    const stage = Math.ceil(this.level / 20);

    this.xp = xp ? xp : 0;
    this.reqXp = reqXp;
    this.stage = stage;

    this.hpStat = calculateStat(this, 'hp');
    this.atkStat = calculateStat(this, 'atk');
    this.defStat = calculateStat(this, 'def');
    this.spdStat = calculateStat(this, 'spd');

    this.nickname = '';
    this.favourite = false;

    this.ivTotal = this.ivHp + this.ivAtk + this.ivDef + this.ivSpd;
    this.ivAverage = parseFloat(((this.ivTotal / 124) * 100).toFixed(2));

    const petData = PetData.get(this.petId);
    if (petData?.hasMega) {
      this.mega = petData.mega;
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
    const pet = await petSchema.create(data);
    this._id = pet._id;
    await petUserSchema.findOneAndUpdate(
      { userId: this.ownerId },
      { selectedId: this._id },
      { upsert: true }
    );
    return pet;
  }
}
