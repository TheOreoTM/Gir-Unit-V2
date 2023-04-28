import { PunishmentType } from '#lib/types';
import mongoose, { Schema } from 'mongoose';
const reqString = {
  type: String,
  required: true,
};

const punishmentSchema = new Schema(
  {
    userId: reqString,
    guildId: reqString,
    staffId: reqString,
    expires: { type: Date, required: true },
    caseNum: { type: Number, required: true },
    type: {
      type: String,
      required: true,
      enum: PunishmentType,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('punishments', punishmentSchema, 'punishments');
