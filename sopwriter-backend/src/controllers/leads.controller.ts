import type { Request, Response } from 'express';
import * as leadService from '../services/lead.service.js';
import type { IHistoryEntry } from '../models/Lead.js';
import { MailService } from '../services/mail.service.js';
import { config_vars } from '../config/env.js';

const mail = new MailService({
  from: config_vars.email.from,
  adminEmail: config_vars.email.adminNotify,
});

export async function createLeadHandler(req: Request, res: Response) {
  const payload = (req as any).validatedBody;
  try {
    const lead = await leadService.createLead(payload);
    // send confirmation email (fire-and-forget but await for tests)
    try {
      await mail.sendLeadConfirmation(lead.email, {
        name: lead.name,
        leadId: lead._id.toString(),
        service: lead.service,
        adminEmail: mail.adminEmail,
        appUrl: process.env.APP_BASE_URL || 'http://localhost:4000',
      });
    } catch (emailErr) {
      console.error('Failed to send lead confirmation email:', emailErr);
    }

    // If this was a dedupe (history last item might be DUPLICATE_ATTEMPT), return 200 and note it
    const isDuplicate =
      lead.history && lead.history.some((h: IHistoryEntry) => h.action === 'DUPLICATE_ATTEMPT');
    const statusCode = isDuplicate ? 200 : 201;
    return res.status(statusCode).json({ success: true, data: { leadId: lead._id } });
  } catch (err: any) {
    console.error('createLead error', err);
    return res
      .status(500)
      .json({ success: false, code: 'INTERNAL_ERROR', message: 'Could not create lead' });
  }
}

export async function getLeadPublic(req: Request, res: Response) {
  const { leadId } = req.params;
  try {
    const lead = await leadService.getLeadById(leadId);
    if (!lead)
      return res
        .status(404)
        .json({ success: false, code: 'LEAD_NOT_FOUND', message: 'Lead not found' });
    const lite = {
      _id: lead._id,
      name: lead.name,
      email: lead.email,
      service: lead.service,
      status: lead.status,
      createdAt: lead.createdAt,
    };
    return res.json({ success: true, data: lite });
  } catch (_err) {
    return res
      .status(500)
      .json({ success: false, code: 'INTERNAL_ERROR', message: 'Could not fetch lead' });
  }
}
