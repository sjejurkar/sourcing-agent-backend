export interface VapiCallRequest {
  assistantId: string;
  phoneNumberId: string; // Vapi phone number ID (caller)
  customer: {
    name?: string;
    number: string; // E.164 format: +12145551234 (recipient)
  };
  assistantOverrides?: {
    variableValues?: Record<string, string | number>;
  };
}

export interface VapiCallResponse {
  id: string;
  status: string;
  createdAt: string;
  // Add other fields based on actual Vapi API response
}

export interface VapiStructuredOutput {
  name: string;
  result: string | number | boolean | null;
  compliancePlan: null | unknown;
}

export interface VapiEOCR {
  message: {
    type: string;
    timestamp: number;
    artifact?: {
      messages?: any[];
      structuredOutputs?: Record<string, VapiStructuredOutput>;
      [key: string]: any;
    };
    call?: {
      id: string;
      status: string;
      // Add other call fields from Vapi documentation
    };
    assistant?: {
      variableValues?: {
        vendor_name?: string;
        part_number?: string;
        quantity_needed?: number;
        due_date?: string;
        [key: string]: any;
      };
      [key: string]: any;
    };
    [key: string]: any;
  };
}
