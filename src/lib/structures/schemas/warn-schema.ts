import mongoose, { Schema } from 'mongoose';

const reqString = {
  type: String,
  requred: true,
};

const warnSchema = new Schema(
  {
    _id: reqString, // Warn Id
    guildId: reqString,
    memberId: reqString,
    memberTag: reqString,
    staffId: reqString,
    staffTag: reqString,
    reason: reqString,
    case: reqString,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('warnings', warnSchema, 'warnings');
