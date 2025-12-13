import express from 'express';
import { requireAdmin } from '../../middlewares/auth.js';
import { validateRequest } from '../../middlewares/validateRequest.js';
import { verifyTransactionSchema } from '../../utils/zodSchemas.js';
import {
  listTransactions,
  listLeads,
  getTransactionDetail,
  verifyTransactionHandler,
  loginHandler,
} from '../../controllers/admin.controller.js';
import {
  getAllServices,
  createService,
  updateService,
  deleteService,
  getAllSettings,
  updateSetting,
  deleteSetting,
} from '../../controllers/settings.controller.js';

const router = express.Router();

router.post('/login', loginHandler);

// apply auth to all admin routes
router.use(requireAdmin);

router.get('/leads', listLeads);
router.get('/transactions', listTransactions);
router.get('/transactions/:id', getTransactionDetail);
router.post(
  '/transactions/:id/verify',
  validateRequest(verifyTransactionSchema),
  verifyTransactionHandler
);

// Services Management
router.get('/services', getAllServices);
router.post('/services', createService);
router.put('/services/:id', updateService);
router.delete('/services/:id', deleteService);

// Settings Management
router.get('/settings', getAllSettings);
router.put('/settings/:key', updateSetting);
router.delete('/settings/:key', deleteSetting);

export default router;
