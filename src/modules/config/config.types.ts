export interface AppConfig {
  server: {
    port: number;
    nodeEnv: 'development' | 'production' | 'test';
  };
  vapi: {
    apiKey: string;
    assistantId: string;
    phoneNumberId: string;
    apiBaseUrl: string;
  };
  slack: {
    webhookUrl: string;
  };
  logging: {
    level: 'debug' | 'info' | 'warn' | 'error';
    pretty: boolean;
  };
  auth: {
    apiKey: string;
  };
}
