export interface LogContext {
  requestId?: string;
  vapiCallId?: string;
  operation?: string;
  [key: string]: unknown;
}
