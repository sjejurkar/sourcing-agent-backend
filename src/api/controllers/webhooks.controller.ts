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

    // Log EOCR webhook receipt
    log.info('Received EOCR webhook');

    // Log payload metadata as separate entry
    const payloadSize = JSON.stringify(req.body).length;
    log.info(`EOCR metadata: size=${payloadSize} bytes, type=${req.body?.message?.type}, timestamp=${req.body?.message?.timestamp}`);

    // Log full EOCR payload (use console.log for better Vercel visibility)
    console.log('=== EOCR Full Payload ===');
    console.log(JSON.stringify(req.body, null, 2));
    console.log('=== End EOCR Payload ===');

    // Log structured outputs if present
    if (req.body?.message?.artifact?.structuredOutputs) {
      const structuredOutputs = req.body.message.artifact.structuredOutputs;
      const outputFields = Object.values(structuredOutputs).map((output: any) => output.name);
      log.info(`EOCR structured output fields: ${outputFields.join(', ')}`);
    }

    // Process EOCR and wait for completion (required for serverless environments)
    await eocrService.processEOCR(req.body, requestId);

    // Return 200 to Vapi after processing completes
    res.status(200).json({ status: 'received' });
  } catch (error) {
    next(error);
  }
};
