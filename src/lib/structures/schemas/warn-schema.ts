import mongoose, { Schema } from 'mongoose';

const reqString = {
  type: String,
  required: true,
};

const warnSchema = new Schema(
  {
    _id: reqString, // Warn Id
    guildId: reqString,
    userId: reqString,
    userName: reqString,
    staffId: reqString,
    staffName: reqString,
    reason: reqString,
    caseNum: reqString,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('warnings', warnSchema, 'warnings');
