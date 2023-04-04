import mongoose from 'mongoose';
export async function connectToMongo(URI: string) {
  mongoose.set('strictQuery', true);
  await mongoose
    .connect(URI, {
      keepAlive: true,
    })
    .then(() => {
      console.log('Mongoose connected!');
    })
    .catch((err) => {
      console.log('Mongoose failed to connect', err);
    });
}
