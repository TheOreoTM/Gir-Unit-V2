import mongoose, { Schema } from 'mongoose';

const reqString = {
  type: String,
  requred: true,
};

const modlogsSchema = new Schema(
  {
    guildId: reqString,
    userId: reqString,
    userTag: reqString,

    staffTag: reqString,
    staffId: reqString,
    action: reqString,
    reason: reqString,
    length: { type: Number || null },
    case: reqString,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('modlogs', modlogsSchema, 'modlogs');
