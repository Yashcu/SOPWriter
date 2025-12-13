import { jest, describe, it, expect, beforeAll, afterAll, afterEach } from '@jest/globals';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import { createApp } from '../../app.js';
import * as mailModule from '../../services/mail.service.js';
import jwt from 'jsonwebtoken';

let mongod: MongoMemoryServer;
let app: any;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
  app = createApp();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

afterEach(async () => {
  const { collections } = mongoose.connection;
  for (const k in collections) await collections[k].deleteMany({});
});

describe('full integration flow', () => {
  it('lead -> declare -> admin verify', async () => {
    // We must spy on the prototype since the app uses new MailService()
    // And we need to ensure we are mocking the methods effectively.
    // However, in ESM, mocking with jest.spyOn works if the module exports class.
    // But internal calls within class might not be intercepted if not careful?
    // No, prototype spy is standard.
    // NOTE: MailService is exported as a class.

    const leadSpy = jest
      .spyOn(mailModule.MailService.prototype, 'sendLeadConfirmation')
      .mockResolvedValue({ ok: true } as any);
    const adminSpy = jest
      .spyOn(mailModule.MailService.prototype, 'sendAdminNotification')
      .mockResolvedValue({ ok: true } as any);
    const userVerifySpy = jest
      .spyOn(mailModule.MailService.prototype, 'sendUserVerification')
      .mockResolvedValue({ ok: true } as any);

    const leadRes = await request(app)
      .post('/api/leads')
      .send({ name: 'Full', email: 'full@example.com', service: 'VISA_TOURIST' })
      .expect(201);
    const leadId = leadRes.body.data.leadId;
    expect(leadSpy).toHaveBeenCalled();

    const txRes = await request(app)
      .post(`/api/leads/${leadId}/transactions`)
      .send({ transactionId: 'TX-F1' })
      .expect(200);
    expect(adminSpy).toHaveBeenCalled();
    const txId = txRes.body.data.transactionId;

    process.env.JWT_SECRET = 'test-secret';
    const token = jwt.sign({ sub: 'admin', role: 'admin', email: 'a@test' }, 'test-secret', {
      expiresIn: '1h',
    });

    const verifyRes = await request(app)
      .post(`/api/admin/transactions/${txId}/verify`)
      .set('Authorization', `Bearer ${token}`)
      .send({ action: 'VERIFY', note: 'ok' })
      .expect(200);
    expect(verifyRes.body.data.status).toBe('VERIFIED');
    expect(userVerifySpy).toHaveBeenCalled();

    leadSpy.mockRestore();
    adminSpy.mockRestore();
    userVerifySpy.mockRestore();
  });
});
