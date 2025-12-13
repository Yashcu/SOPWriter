import Transaction, { ITransaction } from '../models/Transaction.js';
import Lead from '../models/Lead.js';
import { CreateTransactionDTO } from '../utils/zodSchemas.js';

export async function declareTransaction(
  leadId: string,
  payload: CreateTransactionDTO,
  submittedByIp?: string
): Promise<ITransaction> {
  // ensure lead exists
  const lead = await Lead.findById(leadId).exec();
  if (!lead) throw new Error('LEAD_NOT_FOUND');

  // Check for existing transaction (Idempotency)
  const existingTx = await Transaction.findOne({
    leadId: lead._id,
    transactionId: payload.transactionId,
  }).exec();

  if (existingTx) {
    return existingTx;
  }

  const tx = new Transaction({
    leadId: lead._id,
    transactionId: payload.transactionId,
    amount: payload.amount,
    method: payload.method,
    remark: payload.remark,
    submittedByIp,
  });

  tx.history.push({ action: 'DECLARED', by: 'public', note: payload.remark });
  await tx.save();

  // append to lead history
  lead.history.push({
    action: 'PAYMENT_DECLARED',
    note: `Transaction ${tx._id} declared`,
    by: 'public',
  });
  // Optionally update lead.status
  lead.status = 'PAYMENT_DECLARED';
  await lead.save();

  return tx;
}

export async function getTransactionById(id: string) {
  return Transaction.findById(id).populate('leadId').exec();
}

export async function verifyTransaction(
  id: string,
  admin: { id: string; email?: string },
  action: 'VERIFY' | 'REJECT',
  note?: string
) {
  const tx = await Transaction.findById(id).exec();
  if (!tx) throw new Error('TRANSACTION_NOT_FOUND');

  if (action === 'VERIFY') {
    tx.status = 'VERIFIED';
    tx.verifiedBy = admin.email || admin.id;
    tx.verifiedAt = new Date();
    tx.verificationNote = note;
    tx.history.push({
      action: 'VERIFIED',
      by: admin.email || admin.id,
      note,
      at: new Date(),
    });
  } else {
    tx.status = 'REJECTED';
    tx.verifiedBy = admin.email || admin.id;
    tx.verifiedAt = new Date();
    tx.verificationNote = note;
    tx.history.push({
      action: 'REJECTED',
      by: admin.email || admin.id,
      note,
      at: new Date(),
    });
  }

  await tx.save();

  // update lead accordingly
  const lead = await Lead.findById(tx.leadId).exec();
  if (lead) {
    if (action === 'VERIFY') {
      lead.status = 'VERIFIED';
      lead.history.push({
        action: 'PAYMENT_VERIFIED',
        by: admin.email || admin.id,
        note,
        at: new Date(),
      });
    } else {
      lead.status = 'REJECTED';
      lead.history.push({
        action: 'PAYMENT_REJECTED',
        by: admin.email || admin.id,
        note,
        at: new Date(),
      });
    }
    await lead.save();
  }

  return { tx, lead };
}
