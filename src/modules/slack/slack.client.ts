import axios from 'axios';
import { config } from '../config/config';
import { logger } from '../logging/logger';
import { SlackMessage } from './slack.types';

class SlackClient {
  async sendMessage(message: SlackMessage, requestId: string): Promise<void> {
    const log = logger.child({ requestId, operation: 'slack.sendMessage' });

    log.info({ message }, 'Sending Slack notification');

    try {
      await axios.post(config.slack.webhookUrl, message, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000,
      });

      log.info('Slack notification sent successfully');
    } catch (error) {
      log.error({ error }, 'Failed to send Slack notification');
      // Don't throw - log the error but don't fail the main flow
    }
  }
}

export const slackClient = new SlackClient();
