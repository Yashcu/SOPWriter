import Transaction, { ITransaction } from '../models/Transaction.js';
import Lead from '../models/Lead.js';
import { CreateTransactionDTO } from '../utils/zodSchemas.js';
import { NotFoundError } from '../utils/errors.js';
import mongoose from 'mongoose';
import { HistoryAction, LeadStatus, TransactionStatus } from '../constants/index.js';
import { MailService } from './mail.service.js';
import { config_vars } from '../config/env.js';

export async function declareTransaction(
  leadId: string,
  payload: CreateTransactionDTO,
  submittedByIp?: string
): Promise<ITransaction> {
  const mail = MailService.getInstance();

  // ensure lead exists
  const lead = await Lead.findById(leadId).exec();
  if (!lead) throw new NotFoundError('Lead', leadId);

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

  tx.history.push({ action: HistoryAction.DECLARED, by: 'public', note: payload.remark });
  await tx.save();

  // append to lead history
  lead.history.push({
    action: HistoryAction.PAYMENT_DECLARED,
    note: `Transaction ${tx._id} declared`,
    by: 'public',
  });
  // Optionally update lead.status
  lead.status = LeadStatus.PAYMENT_DECLARED;
  await lead.save();

  // notify admin (fire-and-forget)
  mail
    .sendAdminNotification({
      transactionId: tx.transactionId,
      leadId: lead._id.toString(),
      leadName: lead.name,
      leadEmail: lead.email,
      appUrl: config_vars.app.baseUrl,
    })
    .catch(() => {});

  return tx;
}

export async function getTransactionById(id: string) {
  return Transaction.findById(id).populate('leadId').exec();
}

/**
 * Helper to get verification update data based on action
 */
function getVerificationUpdate(action: 'VERIFY' | 'REJECT') {
  return action === 'VERIFY'
    ? {
        txStatus: TransactionStatus.VERIFIED,
        txAction: HistoryAction.VERIFIED,
        leadStatus: LeadStatus.VERIFIED,
        leadAction: HistoryAction.PAYMENT_VERIFIED,
      }
    : {
        txStatus: TransactionStatus.REJECTED,
        txAction: HistoryAction.REJECTED,
        leadStatus: LeadStatus.REJECTED,
        leadAction: HistoryAction.PAYMENT_REJECTED,
      };
}

/**
 * Check if MongoDB transactions are supported (requires replica set)
 */
async function isTransactionSupported(): Promise<boolean> {
  try {
    const session = await mongoose.startSession();
    session.endSession();
    // Check if we're connected to a replica set
    const adminDb = mongoose.connection.db?.admin();
    if (!adminDb) return false;
    const serverStatus = await adminDb.serverStatus();
    return serverStatus.repl !== undefined;
  } catch (error) {
    return false;
  }
}

/**
 * Verify or reject a transaction with database transaction support (when available)
 */
export async function verifyTransaction(
  id: string,
  admin: { id: string; email?: string },
  action: 'VERIFY' | 'REJECT',
  note?: string
) {
  const supportsTransactions = await isTransactionSupported();

  const performVerification = async (session?: mongoose.ClientSession) => {
    const tx = await Transaction.findById(id)
      .session(session || null)
      .exec();
    if (!tx) throw new NotFoundError('Transaction', id);

    const update = getVerificationUpdate(action);
    const adminIdentifier = admin.email || admin.id;
    const timestamp = new Date();

    // Update transaction
    tx.status = update.txStatus;
    tx.verifiedBy = adminIdentifier;
    tx.verifiedAt = timestamp;
    tx.verificationNote = note;
    tx.history.push({
      action: update.txAction,
      by: adminIdentifier,
      note,
      at: timestamp,
    });

    await tx.save({ session });

    // Update lead
    const lead = await Lead.findById(tx.leadId)
      .session(session || null)
      .exec();
    if (lead) {
      lead.status = update.leadStatus;
      lead.history.push({
        action: update.leadAction,
        by: adminIdentifier,
        note,
        at: timestamp,
      });
      await lead.save({ session });
    }

    return { tx, lead };
  };

  if (supportsTransactions) {
    // Use MongoDB transactions for atomicity
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const result = await performVerification(session);
      await session.commitTransaction();
      sendMail(result);
      return result;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } else {
    // Fallback: No transaction support (e.g., standalone MongoDB in tests)
    const result = await performVerification();
    sendMail(result);
    return result;
  }

  function sendMail(result: { tx: any; lead: any }) {
    if (result.lead) {
      MailService.getInstance()
        .sendUserVerification(result.lead.email, {
          name: result.lead.name,
          leadId: result.lead._id.toString(),
          status: action === 'VERIFY' ? 'VERIFIED' : 'REJECTED',
          note,
          appUrl: config_vars.app.baseUrl,
        })
        .catch(() => {});
    }
  }
}
