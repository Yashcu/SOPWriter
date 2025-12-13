import { jest, describe, it, expect } from '@jest/globals';

const sendMailMock = jest.fn() as any;
sendMailMock.mockResolvedValue({ messageId: 'abc' });

// Hoist mock factory
jest.unstable_mockModule('nodemailer', () => ({
  default: {
    createTransport: jest.fn().mockReturnValue({ sendMail: sendMailMock }),
  },
}));

// Dynamic import needed after unstable_mockModule for it to take effect in ESM
const { MailService } = await import('../../services/mail.service.js');

describe('MailService (SMTP mock)', () => {
  it('sends mail via SMTP and retries on failure', async () => {
    const svc = new MailService({
      from: 'noreply@test',
      adminEmail: 'admin@test',
      provider: 'smtp',
      smtpConfig: { host: 'smtp.test' } as any,
      retryAttempts: 2,
    });

    // normal send
    await expect(svc.send('to@test', 'sub', 'body')).resolves.toEqual({ ok: true });

    // simulate transient failure first then success
    sendMailMock.mockRejectedValueOnce(new Error('ENETUNREACH'));
    sendMailMock.mockResolvedValueOnce({ messageId: 'ok' });
    const res = await svc.send('to@test', 'sub2', 'body2');
    expect(res).toEqual({ ok: true });
  });
});
