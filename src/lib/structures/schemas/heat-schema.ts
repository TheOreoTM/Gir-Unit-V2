import mongoose, { Schema } from 'mongoose';

const reqString = {
  type: String,
  required: true,
};

const heatSchema = new Schema(
  {
    memberId: reqString,
    guildId: reqString,
    rule: { enum: ['bannedWords', 'links'], type: String, required: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

heatSchema.index(
  { expiresAt: 1 },
  {
    expireAfterSeconds: 0, // set to 0 to use dynamic TTL
  }
);

export default mongoose.model('heat', heatSchema, 'heat');
