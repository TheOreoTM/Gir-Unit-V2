import mongoose, { Schema } from 'mongoose';

const reqString = {
  type: String,
  required: true,
};

const loggingSchema = new Schema({
  _id: reqString, // Guild ID
  message: reqString,
  member: reqString,
  server: reqString,
  moderation: reqString,
  transcripts: reqString,
  channel: reqString,
  role: reqString,

  ignoredChannels: { type: Array, required: true, default: [] },
});

export default mongoose.model('logs', loggingSchema, 'logs');
