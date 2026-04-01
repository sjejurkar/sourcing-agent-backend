import { ExtractedEOCRData } from '../eocr/eocr.types';
import { formatDateForSlack } from '../../utils/date.utils';
import { SlackMessage } from './slack.types';

export const formatEOCRForSlack = (
  data: ExtractedEOCRData,
  vendorName: string,
  partNumber: string,
): SlackMessage => {
  let message = `📞 *Vendor Call Completed*\n\n`;
  message += `*Vendor:* ${vendorName}\n`;
  message += `*Contact Reached:* ${data.vendorContactReached ? 'Yes' : 'No'}\n`;

  if (data.contactName) {
    message += `*Contact Name:* ${data.contactName}\n`;
  }

  message += `\n*Part:* ${partNumber}\n`;

  if (data.availabilityStatus) {
    message += `*Availability:* ${data.availabilityStatus}\n`;
  }

  if (data.quantityAvailable !== null) {
    message += `*Qty Available:* ${data.quantityAvailable}\n`;
  }

  if (data.deliveryDate) {
    message += `*Delivery Date:* ${formatDateForSlack(data.deliveryDate)}\n`;
  }

  // Substitute part section
  if (data.substitutePartNumber) {
    message += `\n*Substitute Part:* ${data.substitutePartNumber}\n`;

    if (data.substituteAvailability !== null) {
      message += `*Substitute Available:* ${data.substituteAvailability ? 'Yes' : 'No'}\n`;
    }

    if (data.substituteDeliveryDate) {
      message += `*Substitute Delivery:* ${formatDateForSlack(data.substituteDeliveryDate)}\n`;
    }
  }

  return { text: message };
};
