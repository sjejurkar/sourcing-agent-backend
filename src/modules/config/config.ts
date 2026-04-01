import { config as dotenvConfig } from 'dotenv';
import { configSchema } from './config.schema';
import { AppConfig } from './config.types';

// Load .env file
dotenvConfig();

// Validate and parse environment variables
const env = configSchema.parse(process.env);

// Export typed configuration
export const config: AppConfig = {
  server: {
    port: parseInt(env.PORT, 10),
    nodeEnv: env.NODE_ENV,
  },
  vapi: {
    apiKey: env.VAPI_API_KEY,
    assistantId: env.VAPI_ASSISTANT_ID,
    phoneNumberId: env.VAPI_PHONE_NUMBER_ID,
    apiBaseUrl: env.VAPI_API_BASE_URL,
  },
  slack: {
    webhookUrl: env.SLACK_WEBHOOK_URL,
  },
  logging: {
    level: env.LOG_LEVEL,
    pretty: env.LOG_PRETTY,
  },
  auth: {
    apiKey: env.API_KEY,
  },
};
