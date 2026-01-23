import type { Request, Response } from 'express';
import * as leadService from '../services/lead.service.js';
import { NotFoundError } from '../utils/errors.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { successResponse } from '../utils/responses.js';
import { TypedRequest } from '../types/request.js';
import { CreateLeadDTO } from '../utils/zodSchemas.js';

export const createLeadHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const typedReq = req as TypedRequest<CreateLeadDTO>;
    const { lead, isDuplicate } = await leadService.createLead(typedReq.validatedBody);

    const statusCode = isDuplicate ? 200 : 201;
    res.status(statusCode).json(successResponse({ leadId: lead._id }));
  }
);

export const getLeadPublic = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { leadId } = req.params;
  const lead = await leadService.getLeadById(leadId);
  if (!lead) throw new NotFoundError('Lead', leadId);

  const lite = {
    _id: lead._id,
    name: lead.name,
    email: lead.email,
    service: lead.service,
    status: lead.status,
    createdAt: lead.createdAt,
  };
  res.json(successResponse(lite));
});
