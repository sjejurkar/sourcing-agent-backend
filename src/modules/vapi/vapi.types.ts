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

export interface VapiEOCR {
  call: {
    id: string;
    status: string;
    // Add other call fields from Vapi documentation
  };
  structuredData?: Record<string, unknown>;
  transcript?: string;
  // Add other fields based on actual Vapi EOCR structure
}
