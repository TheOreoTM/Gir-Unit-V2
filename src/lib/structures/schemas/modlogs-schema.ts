import mongoose, { Schema } from 'mongoose';

const reqString = {
  type: String,
  required: true,
};

const modlogsSchema = new Schema(
  {
    guildId: reqString,
    userId: reqString,
    userName: reqString,

    messageId: { type: String, required: false, default: '0' },
    messageUrl: { type: String, required: false, default: '0' },

    staffName: reqString,
    staffId: reqString,
    action: reqString,
    reason: reqString,
    length: { type: Number || null },
    caseNum: reqString,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('modlogs', modlogsSchema, 'modlogs');
