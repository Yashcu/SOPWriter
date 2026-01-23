import type { Request, Response } from 'express';
import * as transactionService from '../services/transaction.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { successResponse } from '../utils/responses.js';
import { getClientIp } from '../utils/requestHelpers.js';
import { TypedRequest } from '../types/request.js';
import { CreateTransactionDTO } from '../utils/zodSchemas.js';

export const declareTransactionHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const typedReq = req as TypedRequest<CreateTransactionDTO>;
    const { leadId } = req.params;
    const ip = getClientIp(req);

    // Service handles logic + notification
    const tx = await transactionService.declareTransaction(leadId, typedReq.validatedBody, ip);

    res.json(successResponse({ transactionId: tx._id }));
  }
);
