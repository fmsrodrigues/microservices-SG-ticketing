import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

declare global {
  var signin: (id?: string) => string[];
}

jest.setTimeout(3 * 60 * 1000);

process.env.STRIPE_KEY = 'sk_test_ZDWO95VJsgp2jqbizl1PlZBk';

let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = "test";

  mongo = new MongoMemoryServer();
  await mongo.start()
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri);
});

jest.mock('../nats-wrapper');
// jest.mock('../stripe');

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.signin = (providedId?: string) => {
  const id = providedId ?? new mongoose.Types.ObjectId().toHexString();
  const email = 'test@test.com';

  const payload = { id, email };

  const token = jwt.sign(payload, process.env.JWT_KEY!);

  const session = { jwt: token };

  const sessionJSON = JSON.stringify(session);

  const base64 = Buffer.from(sessionJSON).toString('base64');

  return [`express:sess=${base64}`];
}