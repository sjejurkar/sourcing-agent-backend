import { z } from 'zod';

export const configSchema = z.object({
  // Server
  PORT: z.string().default('3000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // Vapi
  VAPI_API_KEY: z.string().min(1, 'VAPI_API_KEY is required'),
  VAPI_ASSISTANT_ID: z.string().min(1, 'VAPI_ASSISTANT_ID is required'),
  VAPI_PHONE_NUMBER_ID: z.string().min(1, 'VAPI_PHONE_NUMBER_ID is required'),
  VAPI_API_BASE_URL: z.string().url().default('https://api.vapi.ai'),

  // Slack
  SLACK_WEBHOOK_URL: z.string().url('SLACK_WEBHOOK_URL must be a valid URL'),

  // Logging
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  LOG_PRETTY: z.string().transform(val => val === 'true').default('true'),

  // Auth
  API_KEY: z.string().min(1, 'API_KEY is required'),
});

export type ConfigSchema = z.infer<typeof configSchema>;
