import { MongoURI } from '#config';
import { GirClient } from '#lib/utility/GirClient';
import mongoose from 'mongoose';

mongoose.connect(`${MongoURI}`);

export const client = new GirClient();

client.start();
