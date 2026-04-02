import { ExtractedEOCRData } from '../eocr/eocr.types';
import { formatDateForSlack } from '../../utils/date.utils';
import { SlackMessage } from './slack.types';

export const formatEOCRForSlack = (
  data: ExtractedEOCRData,
  vendorName: string,
  partNumber: string,
): SlackMessage => {
  const blocks: any[] = [
    // Header section
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: '*📞 Vendor Call Completed*',
      },
    },
    // Vendor details section
    {
      type: 'section',
      fields: [
        { type: 'mrkdwn', text: `*Vendor:*\n${vendorName}` },
        { type: 'mrkdwn', text: `*Contact Reached:*\n${data.vendorContactReached ? 'Yes' : 'No'}` },
      ],
    },
  ];

  // Add contact name if available
  if (data.contactName) {
    blocks[1].fields.push({ type: 'mrkdwn', text: `*Contact Name:*\n${data.contactName}` });
  }

  // Add part number
  blocks[1].fields.push({ type: 'mrkdwn', text: `*Part Number:*\n${partNumber}` });

  // Add availability if available
  if (data.availabilityStatus) {
    blocks[1].fields.push({ type: 'mrkdwn', text: `*Availability:*\n${data.availabilityStatus}` });
  }

  // Add quantity if available
  if (data.quantityAvailable !== null) {
    blocks[1].fields.push({ type: 'mrkdwn', text: `*Qty Available:*\n${data.quantityAvailable}` });
  }

  // Add delivery date if available
  if (data.deliveryDate) {
    blocks[1].fields.push({ type: 'mrkdwn', text: `*Delivery Date:*\n${formatDateForSlack(data.deliveryDate)}` });
  }

  // Substitute part section
  if (data.substitutePartNumber) {
    let substituteText = `*Substitute Part:* ${data.substitutePartNumber}`;

    if (data.substituteAvailability !== null) {
      substituteText += `\n*Substitute Available:* ${data.substituteAvailability ? 'Yes' : 'No'}`;
    }

    if (data.substitutePartQuantity !== null) {
      substituteText += `\n*Substitute Qty Available:* ${data.substitutePartQuantity}`;
    }

    if (data.substituteDeliveryDate) {
      substituteText += `\n*Sub Delivery:* ${formatDateForSlack(data.substituteDeliveryDate)}`;
    }

    blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: substituteText,
      },
    });
  }

  return {
    text: 'Vendor Call Completed',
    blocks,
  };
};
