import mongoose, { Schema } from 'mongoose';

const reqString = {
  type: String,
  required: true,
};

const staffRolesSchema = new Schema({
  _id: reqString, // guild ID
  admin: [reqString],
  moderator: [reqString],
  staff: [reqString],
  trainee: [reqString],
});

export default mongoose.model('staffRoles', staffRolesSchema, 'staffRoles');
