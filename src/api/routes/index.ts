import { Router } from 'express';
import callsRoutes from './calls.routes';
import webhooksRoutes from './webhooks.routes';

const router = Router();

router.use('/calls', callsRoutes);
router.use('/webhooks', webhooksRoutes);

export default router;
