import { describe, it, expect, beforeAll, afterAll, afterEach } from '@jest/globals';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { createApp } from '../../app.js';

let mongod: MongoMemoryServer;
let app: any;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri);
  app = createApp();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

afterEach(async () => {
  const { collections } = mongoose.connection;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

describe('Admin transactions endpoints', () => {
  const secret = 'test-secret';
  beforeAll(() => {
    process.env.JWT_SECRET = secret;
  });

  function getAdminToken() {
    return jwt.sign({ sub: 'admin1', role: 'admin' }, secret, { expiresIn: '1h' });
  }

  it('rejects unauthenticated requests', async () => {
    await request(app).get('/api/admin/transactions').expect(401);
  });

  it('returns empty list initially when authenticated', async () => {
    const token = getAdminToken();
    const res = await request(app)
      .get('/api/admin/transactions')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.items).toBeDefined();
    expect(res.body.data.items).toHaveLength(0);
  });

  it('lists declared transactions', async () => {
    const token = getAdminToken();
    // create lead + transaction
    const leadRes = await request(app)
      .post('/api/leads')
      .send({ name: 'Eve', email: 'e@example.com', service: 'VISA_TOURIST' })
      .expect(201);
    const leadId = leadRes.body.data.leadId;
    await request(app)
      .post(`/api/leads/${leadId}/transactions`)
      .send({ transactionId: 'TX-1' })
      .expect(200);

    const res = await request(app)
      .get('/api/admin/transactions')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(res.body.data.items.length).toBe(1);
    const item = res.body.data.items[0];
    expect(item.status).toBe('DECLARED');
    expect(item.lead).toBeDefined();
    expect(item.lead.name).toBe('Eve');
  });

  it('can fetch transaction detail', async () => {
    const token = getAdminToken();
    const leadRes = await request(app)
      .post('/api/leads')
      .send({ name: 'Frank', email: 'f@example.com', service: 'VISA_TOURIST' })
      .expect(201);
    const leadId = leadRes.body.data.leadId;
    const txRes = await request(app)
      .post(`/api/leads/${leadId}/transactions`)
      .send({ transactionId: 'TX-2' })
      .expect(200);
    const txId = txRes.body.data.transactionId;
    const res = await request(app)
      .get(`/api/admin/transactions/${txId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(res.body.data._id).toBe(txId);
    expect(res.body.data.status).toBe('DECLARED');
    expect(res.body.data.leadId).toBeDefined();
  });
});
