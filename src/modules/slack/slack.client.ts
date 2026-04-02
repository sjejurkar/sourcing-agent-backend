import axios from 'axios';
import { config } from '../config/config';
import { logger } from '../logging/logger';
import { SlackMessage } from './slack.types';

class SlackClient {
  async sendMessage(message: SlackMessage, requestId: string): Promise<void> {
    const log = logger.child({ requestId, operation: 'slack.sendMessage' });

    log.info({ message }, 'Sending Slack notification');

    try {
      const response = await axios.post(config.slack.webhookUrl, message, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000,
      });

      log.info({ statusCode: response.status, responseData: response.data }, 'Slack notification sent successfully');
    } catch (error: any) {
      const errorDetails = {
        message: error.message,
        code: error.code,
        response: error.response?.data,
        status: error.response?.status,
        stack: error.stack,
      };
      log.error({ error: errorDetails }, 'Failed to send Slack notification');
      throw error; // Throw to surface the actual error
    }
  }
}

export const slackClient = new SlackClient();
