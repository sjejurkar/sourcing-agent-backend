import { Request, Response, NextFunction } from 'express';
import { AppError, isAppError } from '../../utils/error.utils';
import { logger } from '../../modules/logging/logger';

export interface ErrorResponse {
  status: 'error';
  message: string;
  code?: string;
  details?: unknown;
}

export const errorHandler = (
  error: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const requestId = (req as any).requestId;
  const log = logger.child({ requestId });

  if (isAppError(error)) {
    log.error({
      error: error.message,
      code: error.code,
      statusCode: error.statusCode,
      details: error.details,
    }, 'Application error');

    const response: ErrorResponse = {
      status: 'error',
      message: error.message,
      code: error.code,
      details: error.details,
    };

    res.status(error.statusCode).json(response);
    return;
  }

  // Unexpected error
  log.error({ error: error.stack }, 'Unexpected error');

  const response: ErrorResponse = {
    status: 'error',
    message: 'Internal server error',
  };

  res.status(500).json(response);
};
