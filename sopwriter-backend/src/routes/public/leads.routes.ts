import express from 'express';
import { createLeadHandler, getLeadPublic } from '../../controllers/leads.controller.js';
import { validateRequest } from '../../middlewares/validateRequest.js';
import { createLeadSchema } from '../../utils/zodSchemas.js';
import { leadsRateLimiter } from '../../middlewares/rateLimiter.js';

const router = express.Router();

router.post('/leads', leadsRateLimiter, validateRequest(createLeadSchema), createLeadHandler);
router.get('/leads/:leadId', getLeadPublic);

export default router;
