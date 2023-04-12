import mongoose, { Schema } from 'mongoose';

const reqString = {
  type: String,
  required: true,
};

const prefixSchema = new Schema({
  // guild ID
  _id: reqString,
  prefix: reqString,
});

export default mongoose.model('prefixes', prefixSchema, 'prefixes');
