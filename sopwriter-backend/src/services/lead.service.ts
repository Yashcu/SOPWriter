import Lead, { ILead } from '../models/Lead.js';
import { CreateLeadDTO } from '../utils/zodSchemas.js';
import { DEDUPE, HistoryAction } from '../constants/index.js';

import { MailService } from './mail.service.js';
import { config_vars } from '../config/env.js';

interface CreateLeadResult {
  lead: ILead;
  isDuplicate: boolean;
}

export async function createLead(payload: CreateLeadDTO): Promise<CreateLeadResult> {
  const mail = MailService.getInstance();

  // Dedupe: same name + email + service within window
  const since = new Date(Date.now() - DEDUPE.WINDOW_MS);
  const existing = await Lead.findOne({
    name: payload.name,
    email: payload.email,
    service: payload.service,
    createdAt: { $gte: since },
  }).exec();

  if (existing) {
    // append history about duplicate attempt
    existing.history.push({
      action: HistoryAction.DUPLICATE_ATTEMPT,
      note: 'Duplicate lead within 24h',
      by: 'public',
    });
    await existing.save();
    return { lead: existing, isDuplicate: true };
  }

  const lead = new Lead({ ...payload, history: [{ action: HistoryAction.CREATED, by: 'public' }] });
  await lead.save();

  // Fire-and-forget email
  mail
    .sendLeadConfirmation(lead.email, {
      name: lead.name,
      leadId: lead._id.toString(),
      service: lead.service,
      adminEmail: mail.adminEmail,
      appUrl: config_vars.app.baseUrl,
    })
    .catch(() => {
      // Log error but don't fail request
      // console.error('Failed to send lead confirmation email');
    });

  return { lead, isDuplicate: false };
}

export async function getLeadById(id: string) {
  return Lead.findById(id).lean().exec();
}
