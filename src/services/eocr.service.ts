import { VapiEOCR } from '../modules/vapi/vapi.types';
import { parseEOCR } from '../modules/eocr/eocr.parser';
import { slackClient } from '../modules/slack/slack.client';
import { formatEOCRForSlack } from '../modules/slack/slack.formatter';
import { logger } from '../modules/logging/logger';

class EOCRService {
  async processEOCR(eocr: VapiEOCR, requestId: string): Promise<void> {
    const log = logger.child({ requestId, operation: 'eocrService.processEOCR' });

    log.info('Starting EOCR processing');

    try {
      // Parse EOCR (includes variableValues and structuredOutputs)
      const extractedData = parseEOCR(eocr, requestId);
      log.info({ extractedData }, 'EOCR data extracted, formatting for Slack');

      // Format Slack message (data now includes vendor_name and part_number from variableValues)
      const slackMessage = formatEOCRForSlack(extractedData);
      log.info({ slackMessage }, 'Slack message formatted, sending to Slack');

      // Send Slack notification
      await slackClient.sendMessage(slackMessage, requestId);
      log.info('Slack message sent successfully');

      log.info('EOCR processed successfully');
    } catch (error) {
      log.error({ error }, 'Error processing EOCR');

      // Send error alert to Slack
      await slackClient.sendMessage(
        {
          text: `⚠️ *Error Processing Call Report*\n\nRequest ID: ${requestId}\nError: ${(error as Error).message}`,
        },
        requestId,
      );

      throw error;
    }
  }
}

export const eocrService = new EOCRService();
