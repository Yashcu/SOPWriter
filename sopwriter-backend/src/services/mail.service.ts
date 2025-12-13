import sgMail from '@sendgrid/mail';
import nodemailer from 'nodemailer';

type Provider = 'sendgrid' | 'smtp' | 'memory';

interface MailServiceOptions {
  from: string;
  adminEmail: string;
  provider?: Provider;
  sendgridApiKey?: string;
  smtpConfig?: nodemailer.TransportOptions;
  retryAttempts?: number;
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class MailService {
  private from: string;
  public adminEmail: string;
  private provider: Provider;
  private sgKey?: string;
  private transporter?: nodemailer.Transporter;
  private retryAttempts: number;
  public sentMails: any[] = []; // for testing

  constructor(opts: MailServiceOptions) {
    this.from = opts.from;
    this.adminEmail = opts.adminEmail;
    // Default to 'memory' in test environment if not explicitly set
    if (!opts.provider && process.env.NODE_ENV === 'test') {
      this.provider = 'memory';
    } else {
      this.provider =
        opts.provider || (process.env.MAIL_PROVIDER === 'sendgrid' ? 'sendgrid' : 'smtp');
    }

    this.sgKey = opts.sendgridApiKey || process.env.SENDGRID_API_KEY;
    this.retryAttempts = opts.retryAttempts ?? 3;

    if (this.provider === 'sendgrid') {
      if (!this.sgKey) {
        console.warn('MailService: sendgrid selected but API key missing — falling back to smtp');
        this.provider = 'smtp';
      } else {
        sgMail.setApiKey(this.sgKey);
      }
    }

    if (this.provider === 'smtp') {
      const smtpConfig =
        opts.smtpConfig ||
        ({
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : undefined,
          secure: process.env.SMTP_SECURE === 'true',
          auth: process.env.SMTP_USER
            ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
            : undefined,
        } as nodemailer.TransportOptions);
      this.transporter = nodemailer.createTransport(smtpConfig);
    }
  }

  // low-level send with provider-specific behaviour and retry
  private async rawSend(to: string, subject: string, text: string, html?: string) {
    // memory provider for tests
    if (this.provider === 'memory') {
      const mail = { to, from: this.from, subject, text, html };
      this.sentMails.push(mail);
      return { ok: true, messageId: 'memory-id' };
    }

    let attempt = 0;
    let lastErr: any = null;

    while (attempt < this.retryAttempts) {
      try {
        if (this.provider === 'sendgrid') {
          await sgMail.send({ to, from: this.from, subject, text, html });
        } else if (this.provider === 'smtp') {
          if (!this.transporter) throw new Error('SMTP transporter not configured');
          await this.transporter.sendMail({ to, from: this.from, subject, text, html });
        }
        return { ok: true };
      } catch (err: any) {
        lastErr = err;
        attempt++;

        // Retry on transient errors: network errors or 5xx status codes
        // Network errors don't have response.statusCode, so retry them
        const isNetworkError = !err?.response?.statusCode;
        const is5xxError = err?.response?.statusCode >= 500;
        const isTransient = isNetworkError || is5xxError;

        if (attempt >= this.retryAttempts || !isTransient) break;

        const delay = 2 ** attempt * 100; // exponential backoff: 200ms, 400ms, 800ms
        await wait(delay);
      }
    }
    throw lastErr || new Error('Mail send failed');
  }

  async send(to: string, subject: string, body: string, opts?: { html?: string }) {
    return this.rawSend(to, subject, body, opts?.html);
  }

  // Cleanup method to close transporter and prevent connection leaks
  async close(): Promise<void> {
    if (this.transporter) {
      this.transporter.close();
    }
  }

  async sendLeadConfirmation(
    to: string,
    vars: { name: string; leadId: string; service: string; adminEmail: string; appUrl: string }
  ) {
    const subject = `Request Received — ${vars.service}`;
    const text = `Hi ${vars.name},\n\nWe received your request. Your Reference ID is: ${vars.leadId}\n\nPlease proceed to payment (or continue later) at: ${vars.appUrl}/payment?leadId=${vars.leadId}\n\nIf you have any questions, reply to this email.\n\nThanks.`;
    const html = `<p>Hi ${vars.name},</p><p>We received your request.</p><p>Your Reference ID is: <strong>${vars.leadId}</strong></p><p>Please <a href="${vars.appUrl}/payment?leadId=${vars.leadId}">click here to complete your payment</a>.</p><p>You can also use this Reference ID to track your application on our website later.</p><p>Thanks.</p>`;
    return this.send(to, subject, text, { html });
  }

  async sendAdminNotification(vars: {
    transactionId?: string;
    leadId: string;
    leadName: string;
    leadEmail: string;
    appUrl: string;
  }) {
    const subject = `Payment declared: ${vars.transactionId || '(no-id)'} for lead ${vars.leadId}`;
    const text = `Transaction declared for lead ${vars.leadId} (${vars.leadName} / ${vars.leadEmail}).\nView: ${vars.appUrl}/admin/transactions?leadId=${vars.leadId}`;
    return this.send(this.adminEmail, subject, text);
  }

  async sendUserVerification(
    to: string,
    vars: {
      name: string;
      leadId: string;
      status: 'VERIFIED' | 'REJECTED';
      note?: string;
      appUrl: string;
    }
  ) {
    const subject = `Payment ${vars.status} for Lead ${vars.leadId}`;
    const text = `Hi ${vars.name},\n\nYour payment for lead ${vars.leadId} has been ${vars.status}.\n${vars.note ? 'Note from admin: ' + vars.note + '\n' : ''}\nYou can view details at ${vars.appUrl}/leads/${vars.leadId}\n\nThanks.`;
    return this.send(to, subject, text);
  }
}
