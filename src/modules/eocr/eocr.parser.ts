import { VapiEOCR } from '../vapi/vapi.types';
import { ExtractedEOCRData, AvailabilityStatus } from './eocr.types';
import { logger } from '../logging/logger';

/**
 * Converts Vapi's GUID-keyed structuredOutputs to a name-value map
 */
const convertStructuredOutputs = (structuredOutputs: Record<string, any>): Record<string, any> => {
  const result: Record<string, any> = {};

  for (const key in structuredOutputs) {
    const output = structuredOutputs[key];
    if (output?.name && output.result !== undefined) {
      result[output.name] = output.result;
    }
  }

  return result;
};

/**
 * Maps Vapi's availability status values to our internal enum
 */
const mapAvailabilityStatus = (vapiStatus: string | null | undefined): AvailabilityStatus | null => {
  if (!vapiStatus) return null;

  const statusMap: Record<string, AvailabilityStatus> = {
    'in_stock': 'Available',
    'out_of_stock': 'Not Available',
    'partial': 'Partial',
    'substitute_offered': 'Partial', // Treat substitute_offered as Partial
  };

  return statusMap[vapiStatus] || null;
};

/**
 * Extracts structured data from EOCR payload
 * Handles missing/partial data gracefully
 */
export const parseEOCR = (eocr: VapiEOCR, requestId: string): ExtractedEOCRData => {
  const log = logger.child({ requestId, operation: 'eocr.parse' });

  try {
    // Extract variableValues (request context)
    const variableValues = eocr.message?.assistant?.variableValues || {};
    log.debug({ variableValues }, 'Extracted variable values');

    // Convert GUID-keyed structuredOutputs to name-value map
    const structuredOutputs = eocr.message?.artifact?.structuredOutputs;
    const outputs = structuredOutputs
      ? convertStructuredOutputs(structuredOutputs)
      : {};

    log.debug({ rawOutputs: outputs }, 'Converted structured outputs');

    const extracted: ExtractedEOCRData = {
      // Request context (from variableValues)
      vendorName: (variableValues.vendor_name as string) || null,
      partNumber: (variableValues.part_number as string) || null,
      quantityNeeded: typeof variableValues.quantity_needed === 'number'
        ? variableValues.quantity_needed
        : null,
      dueDate: (variableValues.due_date as string) || null,

      // Call outcome (from structuredOutputs)
      vendorContactReached: Boolean(outputs.part_contact_name),
      contactName: (outputs.part_contact_name as string) || null,
      availabilityStatus: mapAvailabilityStatus(outputs.part_availability_status as string),
      quantityAvailable: typeof outputs.part_quantity_available === 'number'
        ? outputs.part_quantity_available
        : null,
      deliveryDate: (outputs.part_delivery_date as string) || null,
      substitutePartNumber: (outputs.substitute_part_number as string) || null,
      substituteAvailability: outputs.substitute_availability !== undefined
        ? Boolean(outputs.substitute_availability)
        : null,
      substitutePartQuantity: typeof outputs.substitute_part_quantity === 'number'
        ? outputs.substitute_part_quantity
        : null,
      substituteDeliveryDate: (outputs.substitute_delivery_date as string) || null,
    };

    log.info({ extracted }, 'EOCR parsed successfully');
    return extracted;
  } catch (error) {
    log.error({ error }, 'Error parsing EOCR');
    throw error;
  }
};
