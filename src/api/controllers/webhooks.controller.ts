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

    // Log EOCR payload metadata (always visible in Vercel logs)
    const payloadSize = JSON.stringify(req.body).length;
    log.info({
      payloadSize,
      messageType: req.body?.message?.type,
      timestamp: req.body?.message?.timestamp,
      hasStructuredOutputs: !!req.body?.message?.artifact?.structuredOutputs,
    }, 'Received EOCR webhook - metadata');

    // Log full EOCR payload as JSON string (may be truncated in Vercel)
    log.info({ eocrPayload: JSON.stringify(req.body, null, 2) }, 'EOCR full payload');

    // Log structured outputs keys separately for visibility
    if (req.body?.message?.artifact?.structuredOutputs) {
      const structuredOutputs = req.body.message.artifact.structuredOutputs;
      const outputFields = Object.values(structuredOutputs).map((output: any) => output.name);
      log.info({ structuredOutputFields: outputFields }, 'EOCR structured output fields');
    }

    // Process EOCR and wait for completion (required for serverless environments)
    await eocrService.processEOCR(req.body, requestId);

    // Return 200 to Vapi after processing completes
    res.status(200).json({ status: 'received' });
  } catch (error) {
    next(error);
  }
};
