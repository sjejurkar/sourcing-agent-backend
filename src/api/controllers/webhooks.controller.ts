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

    // Process EOCR and wait for completion (required for serverless environments)
    await eocrService.processEOCR(req.body, requestId);

    // Return 200 to Vapi after processing completes
    res.status(200).json({ status: 'received' });
  } catch (error) {
    next(error);
  }
};
