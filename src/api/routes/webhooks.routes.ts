import { Router } from 'express';
import { handleEOCR } from '../controllers/webhooks.controller';

const router = Router();

router.post('/vapi/eocr', handleEOCR);

export default router;
