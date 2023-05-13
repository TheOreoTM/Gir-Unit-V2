import mongoose, { Schema } from 'mongoose';

const reqString = {
  type: String,
  required: true,
};

const baseData = {
  enabled: { type: Boolean, required: true, default: false },
  ignoredRoles: { type: [String], required: true, default: [] },
  ignoredChannels: { type: [String], required: true, default: [] },
  violations: { type: Number, required: true, default: 3 },
  duration: { type: Number, required: true, default: 300 },
  threshold: { type: Number, required: true, default: 100 },
  action: { type: String, required: true, default: 'warn' },
  punishmentDuration: { type: Number, required: true, default: 0 },
  alert: { type: Boolean, required: false },
  log: { type: Boolean, required: false },
  delete: { type: Boolean, required: false },
};

const bannedWordData = {
  bannedWords: { type: [String], required: true, default: [] },
  ...baseData,
};

const automodSchema = new Schema({
  _id: reqString, // Guild ID
  bannedWords: { type: bannedWordData, required: true },
});

export default mongoose.model('automod', automodSchema, 'automod');
