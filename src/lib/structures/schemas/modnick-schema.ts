import mongoose, { Schema } from 'mongoose';

const reqString = {
  type: String,
  required: true,
};

const modnickSchema = new Schema({
  guildId: reqString,
  userId: reqString,
  identifier: reqString,
  nickname: reqString,
  oldNickname: reqString,
  frozen: { type: Boolean, required: true, default: false },
});

export default mongoose.model('modnicks', modnickSchema, 'modnicks');
