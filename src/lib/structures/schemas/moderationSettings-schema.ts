import mongoose, { Schema } from 'mongoose';

const reqString = {
  type: String,
  required: true,
};

const STRING = {
  type: String,
};

const reqBoolean = {
  type: Boolean,
  required: true,
  default: false,
};

const moderationSettingsSchema = new Schema({
  _id: reqString, // guild ID
  autoDelete: reqBoolean,
  messageDisplay: reqBoolean,
  reasonDisplay: reqBoolean,
  dm: reqBoolean,
  displayName: reqBoolean,
  muteRole: STRING,
});

export default mongoose.model(
  'moderationSettings',
  moderationSettingsSchema,
  'moderationSettings'
);
