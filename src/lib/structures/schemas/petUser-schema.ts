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

const petDataSchema = new Schema({
  userId: reqString,
  silence: { type: Boolean },

  selectedId: { type: String },
  nextIdx: reqNumber,

  orderBy: { type: Object, required: true, default: { idx: 1 } }, // number-
});

export default mongoose.model('petUser', petDataSchema, 'petUser');
