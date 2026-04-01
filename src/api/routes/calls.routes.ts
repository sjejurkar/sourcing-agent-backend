import { Router } from 'express';
import { startCall } from '../controllers/calls.controller';

const router = Router();

router.post('/start', startCall);

export default router;
