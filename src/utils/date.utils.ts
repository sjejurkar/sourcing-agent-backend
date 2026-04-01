/**
 * Format date for Slack messages
 * Input: "2026-04-08" or "immediately"
 * Output: "Apr 8, 2026" or "immediately"
 *
 * Handles both actual dates and text strings like "immediately", "next week", etc.
 */
export const formatDateForSlack = (dateString: string): string => {
  try {
    const date = new Date(dateString);

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return dateString; // Return original if not a valid date
    }

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateString; // Return original if parsing fails
  }
};
