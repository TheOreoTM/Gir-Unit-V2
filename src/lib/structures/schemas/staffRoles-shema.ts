import mongoose, { Schema } from 'mongoose';

const reqString = {
  type: String,
  requred: true,
};

const staffRolesSchema = new Schema(
  {
    _id: reqString, // guild ID
    admin: [reqString],
    moderator: [reqString],
    staff: [reqString],
    trainee: [reqString],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('staffRoles', staffRolesSchema, 'staffRoles');
