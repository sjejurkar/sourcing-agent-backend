import { Request, Response, NextFunction } from 'express';
import { eocrService } from '../../services/eocr.service';
import { logger } from '../../modules/logging/logger';

export const handleEOCR = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const requestId = (req as any).requestId;
    const log = logger.child({ requestId });

    log.info({ eocr: req.body }, 'Received EOCR webhook');

    // Process EOCR (fire-and-forget style)
    eocrService.processEOCR(req.body, requestId).catch((error) => {
      log.error({ error }, 'Error processing EOCR');
    });

    // Return 200 immediately to Vapi
    res.status(200).json({ status: 'received' });
  } catch (error) {
    next(error);
  }
};
