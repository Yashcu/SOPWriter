import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Lead from '../../models/Lead.js';

let mongod: MongoMemoryServer;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

afterEach(async () => {
  await Lead.deleteMany({});
});

describe('Lead model', () => {
  it('should create a lead with required fields', async () => {
    const lead = new Lead({ name: 'John Doe', email: 'john@example.com', service: 'VISA_TOURIST' });
    const saved = await lead.save();
    expect(saved._id).toBeDefined();
    expect(saved.status).toBe('NEW');
    expect(saved.history).toHaveLength(0);
  });

  it('should require name and email and service', async () => {
    // missing name
    let err: any;
    try {
      const l = new Lead({ email: 'a@b.com', service: 'VISA_TOURIST' } as any);
      await l.save();
    } catch (e) {
      err = e;
    }
    expect(err).toBeDefined();

    // missing email
    err = undefined;
    try {
      const l = new Lead({ name: 'A', service: 'VISA_TOURIST' } as any);
      await l.save();
    } catch (e) {
      err = e;
    }
    expect(err).toBeDefined();
  });
});
