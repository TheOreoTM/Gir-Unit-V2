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
    userTag: reqString,
    staffId: reqString,
    staffTag: reqString,
    reason: reqString,
    caseNum: reqString,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('warnings', warnSchema, 'warnings');
