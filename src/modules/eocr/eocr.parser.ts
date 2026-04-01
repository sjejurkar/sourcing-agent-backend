import { VapiEOCR } from '../vapi/vapi.types';
import { ExtractedEOCRData } from './eocr.types';
import { logger } from '../logging/logger';

/**
 * Extracts structured data from EOCR payload
 * Handles missing/partial data gracefully
 */
export const parseEOCR = (eocr: VapiEOCR, requestId: string): ExtractedEOCRData => {
  const log = logger.child({ requestId, operation: 'eocr.parse' });

  try {
    const structuredData = eocr.structuredData || {};

    const extracted: ExtractedEOCRData = {
      vendorContactReached: Boolean(structuredData.vendor_contact_reached),
      contactName: (structuredData.contact_name as string) || null,
      availabilityStatus: (structuredData.availability_status as any) || null,
      quantityAvailable: typeof structuredData.quantity_available === 'number'
        ? structuredData.quantity_available
        : null,
      deliveryDate: (structuredData.delivery_date as string) || null,
      substitutePartNumber: (structuredData.substitute_part_number as string) || null,
      substituteAvailability: structuredData.substitute_availability !== undefined
        ? Boolean(structuredData.substitute_availability)
        : null,
      substituteDeliveryDate: (structuredData.substitute_delivery_date as string) || null,
    };

    log.info({ extracted }, 'EOCR parsed successfully');
    return extracted;
  } catch (error) {
    log.error({ error }, 'Error parsing EOCR');
    throw error;
  }
};
