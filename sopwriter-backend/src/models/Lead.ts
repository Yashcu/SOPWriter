import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IHistoryEntry {
  action: string;
  note?: string;
  by?: string;
  at?: Date;
}

export interface ILead extends Document {
  name: string;
  email: string;
  phone?: string;
  service: string;
  notes?: string;
  status: 'NEW' | 'PAYMENT_DECLARED' | 'VERIFIED' | 'REJECTED';
  history: IHistoryEntry[];
  createdAt: Date;
  updatedAt: Date;
}

const HistorySchema = new Schema<IHistoryEntry>(
  {
    action: { type: String, required: true },
    note: { type: String },
    by: { type: String },
    at: { type: Date, default: Date.now },
  },
  { _id: false }
);

const LeadSchema = new Schema<ILead>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, index: true },
    phone: { type: String, trim: true },
    service: { type: String, required: true, trim: true },
    notes: { type: String },
    status: {
      type: String,
      enum: ['NEW', 'PAYMENT_DECLARED', 'VERIFIED', 'REJECTED'],
      default: 'NEW',
    },
    history: { type: [HistorySchema], default: [] },
  },
  { timestamps: true }
);

// index on createdAt for sorting queries
LeadSchema.index({ createdAt: -1 });

export const Lead: Model<ILead> = mongoose.models.Lead || mongoose.model<ILead>('Lead', LeadSchema);

export default Lead;
