/**
 * Generates request IDs in format: REQ-YYYY-NNNN
 * Example: REQ-2026-0001
 */
let requestCounter = 0;

export const generateRequestId = (): string => {
  const year = new Date().getFullYear();
  requestCounter = (requestCounter + 1) % 10000; // Reset after 9999
  const sequence = requestCounter.toString().padStart(4, '0');
  return `REQ-${year}-${sequence}`;
};

export const resetRequestCounter = (): void => {
  requestCounter = 0;
};
