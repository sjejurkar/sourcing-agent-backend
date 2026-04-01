import crypto from 'crypto';
import { config } from '../config/config';
import { logger } from '../logging/logger';

/**
 * Validates Vapi webhook signature
 * Implementation depends on Vapi's signature scheme
 * This uses HMAC-SHA256 - adjust based on Vapi's actual documentation
 */
export const validateWebhookSignature = (
  payload: string,
  signature: string | undefined,
): boolean => {
  if (!signature) {
    logger.warn('Missing webhook signature');
    return false;
  }

  try {
    // Example using HMAC-SHA256 (adjust based on Vapi's actual method)
    const expectedSignature = crypto
      .createHmac('sha256', config.vapi.webhookSecret)
      .update(payload)
      .digest('hex');

    const isValid = crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature),
    );

    if (!isValid) {
      logger.warn({ providedSignature: signature }, 'Invalid webhook signature');
    }

    return isValid;
  } catch (error) {
    logger.error({ error }, 'Error validating webhook signature');
    return false;
  }
};
