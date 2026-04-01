import { StartCallRequest } from '../types/api.types';
import { vapiClient } from '../modules/vapi/vapi.client';
import { logger } from '../modules/logging/logger';

class CallService {
  async initiateCall(callData: StartCallRequest, requestId: string): Promise<void> {
    const log = logger.child({ requestId, operation: 'callService.initiateCall' });

    log.info({ callData }, 'Initiating vendor call');

    // Prepare variables for Vapi assistant
    const variables = {
      vendor_name: callData.vendor_name,
      part_number: callData.part_number,
      quantity_needed: callData.quantity_needed,
      due_date: callData.due_date,
    };

    // Call Vapi API
    const vapiResponse = await vapiClient.initiateCall(
      callData.vendor_phone,
      variables,
      requestId,
    );

    log.info({ vapiCallId: vapiResponse.id }, 'Call initiated successfully');
  }
}

export const callService = new CallService();
