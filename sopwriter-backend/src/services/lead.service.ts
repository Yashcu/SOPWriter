import Lead, { ILead } from '../models/Lead.js';
import { CreateLeadDTO } from '../utils/zodSchemas.js';

// Dedupe window in ms (24 hours)
const DEDUPE_WINDOW_MS = 24 * 60 * 60 * 1000;

export async function createLead(payload: CreateLeadDTO): Promise<ILead> {
  // Dedupe: same name + email + service within window
  const since = new Date(Date.now() - DEDUPE_WINDOW_MS);
  const existing = await Lead.findOne({
    name: payload.name,
    email: payload.email,
    service: payload.service,
    createdAt: { $gte: since },
  }).exec();

  if (existing) {
    // append history about duplicate attempt
    existing.history.push({
      action: 'DUPLICATE_ATTEMPT',
      note: 'Duplicate lead within 24h',
      by: 'public',
    });
    await existing.save();
    return existing;
  }

  const lead = new Lead({ ...payload, history: [{ action: 'CREATED', by: 'public' }] });
  await lead.save();
  return lead;
}

export async function getLeadById(id: string) {
  return Lead.findById(id).lean().exec();
}
