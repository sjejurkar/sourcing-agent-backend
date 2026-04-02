export type AvailabilityStatus = 'Available' | 'Not Available' | 'Partial';

export interface ExtractedEOCRData {
  // Request context (from variableValues)
  vendorName: string | null;
  partNumber: string | null;
  quantityNeeded: number | null;
  dueDate: string | null;

  // Call outcome (from structuredOutputs)
  vendorContactReached: boolean;
  contactName: string | null;
  availabilityStatus: AvailabilityStatus | null;
  quantityAvailable: number | null;
  deliveryDate: string | null;
  substitutePartNumber: string | null;
  substituteAvailability: boolean | null;
  substitutePartQuantity: number | null;
  substituteDeliveryDate: string | null;
}
