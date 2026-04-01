export type AvailabilityStatus = 'Available' | 'Not Available' | 'Partial';

export interface ExtractedEOCRData {
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
