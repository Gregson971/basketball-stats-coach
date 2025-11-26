import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongoServer: MongoMemoryServer;

// Setup before all tests
export const setupDatabase = async (): Promise<void> => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
};

// Cleanup after all tests
export const teardownDatabase = async (): Promise<void> => {
  await mongoose.disconnect();
  await mongoServer.stop();
};

// Clear database between tests
export const clearDatabase = async (): Promise<void> => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
};
