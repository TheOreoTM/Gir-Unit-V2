import { container } from '@sapphire/framework';
import mongoose from 'mongoose';

export async function connectToMongo(URI: string) {
  mongoose.set('strictQuery', true);
  await mongoose
    .connect(URI, {
      keepAlive: true,
    })
    .then(() => {
      container.logger.info('Mongoose connected!');
    })
    .catch((err) => {
      container.logger.fatal('Mongoose failed to connect', err);
    });
}
