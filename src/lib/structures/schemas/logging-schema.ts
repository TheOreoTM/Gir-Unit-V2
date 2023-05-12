import mongoose, { Schema } from 'mongoose';

const reqString = {
  type: String,
  required: true,
};

const webhook = {
  url: reqString,
  id: reqString,
};

const reqObject = {
  type: webhook,
  required: true,
};

const loggingSchema = new Schema({
  _id: reqString, // Guild ID
  message: reqObject,
  member: reqObject,
  server: reqObject,
  moderation: reqObject,
  transcripts: reqObject,
  channel: reqObject,
  role: reqObject,

  ignoredChannels: { type: Array, required: true, default: [] },
});

export default mongoose.model('logs', loggingSchema, 'logs');
