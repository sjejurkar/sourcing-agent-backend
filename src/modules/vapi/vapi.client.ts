import axios, { AxiosInstance } from 'axios';
import { config } from '../config/config';
import { logger } from '../logging/logger';
import { VapiCallRequest, VapiCallResponse } from './vapi.types';
import { AppError } from '../../utils/error.utils';

class VapiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: config.vapi.apiBaseUrl,
      headers: {
        'Authorization': `Bearer ${config.vapi.apiKey}`,
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });
  }

  async initiateCall(
    phoneNumber: string,
    variables: Record<string, string | number>,
    requestId: string,
  ): Promise<VapiCallResponse> {
    const log = logger.child({ requestId, operation: 'vapi.initiateCall' });

    const payload: VapiCallRequest = {
      assistantId: config.vapi.assistantId,
      phoneNumberId: config.vapi.phoneNumberId,
      customer: {
        name: variables.vendor_name as string,
        number: phoneNumber,
      },
      assistantOverrides: {
        variableValues: variables,
      },
    };

    log.info({ payload }, 'Initiating Vapi call');

    try {
      const response = await this.client.post<VapiCallResponse>('/call', payload);
      log.info({ response: response.data }, 'Vapi call initiated successfully');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        log.error(
          {
            error: error.message,
            status: error.response?.status,
            statusText: error.response?.statusText,
            responseData: error.response?.data,
            requestPayload: payload,
          },
          'Failed to initiate Vapi call',
        );
        throw new AppError(
          `Vapi API error: ${error.message}`,
          error.response?.status || 500,
          'VAPI_API_ERROR',
          error.response?.data,
        );
      }
      log.error({ error }, 'Failed to initiate Vapi call');
      throw error;
    }
  }
}

export const vapiClient = new VapiClient();
