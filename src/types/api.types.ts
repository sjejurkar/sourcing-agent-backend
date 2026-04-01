import { z } from 'zod';

// Start Call Request Schema
export const startCallRequestSchema = z.object({
  vendor_name: z.string().min(1, 'vendor_name is required'),
  vendor_phone: z.string().regex(/^\+\d{10,15}$/, 'vendor_phone must be in E.164 format (e.g., +12145551234)'),
  part_number: z.string().min(1, 'part_number is required'),
  quantity_needed: z.number().int().positive('quantity_needed must be a positive integer'),
  due_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'due_date must be in YYYY-MM-DD format'),
});

export type StartCallRequest = z.infer<typeof startCallRequestSchema>;

export interface StartCallResponse {
  status: 'success' | 'error';
  call_id: string;
  message: string;
}

export interface ErrorResponse {
  status: 'error';
  message: string;
  code?: string;
  details?: unknown;
}
