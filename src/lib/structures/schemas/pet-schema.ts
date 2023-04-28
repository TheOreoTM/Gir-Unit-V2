import mongoose, { Schema } from 'mongoose';

const reqString = {
  type: String,
  requred: true,
};

const reqNumber = {
  type: Number,
  required: true,
  default: 0,
};

const petSchema = new Schema({
  petId: reqString,
  ownerId: reqString,
  name: reqString,
  nickname: { type: String, required: false },
  favourite: { type: Boolean, default: false, required: true },
  level: reqNumber,
  stage: { type: Number, default: 1, required: true },
  xp: reqNumber,
  reqXp: reqNumber,
  ivHp: reqNumber,
  ivAtk: reqNumber,
  ivDef: reqNumber,
  ivSpd: reqNumber,
  ivTotal: reqNumber,
  ivAverage: reqNumber,
  atkStat: reqNumber,
  hpStat: reqNumber,
  defStat: reqNumber,
  spdStat: reqNumber,
  shiny: { type: Boolean, required: true, default: false },
  moves: { type: Array, required: true, default: [] },
  mega: { type: Object, required: false },
  idx: reqNumber,
});

export default mongoose.model('pets', petSchema, 'pets');
