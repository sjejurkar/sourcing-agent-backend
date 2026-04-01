/**
 * Format date for Slack messages
 * Input: "2026-04-08"
 * Output: "Apr 8, 2026"
 */
export const formatDateForSlack = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateString; // Return original if parsing fails
  }
};
