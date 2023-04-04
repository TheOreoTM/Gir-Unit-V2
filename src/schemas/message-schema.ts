import mongoose, { Schema } from 'mongoose';

const reqString = {
  type: String,
  requred: true,
};

const messagesSchema = new Schema(
  {
    _id: reqString, // Message ID
    guildId: reqString,
    userId: reqString,
    channelId: reqString,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('messages', messagesSchema, 'messages');
