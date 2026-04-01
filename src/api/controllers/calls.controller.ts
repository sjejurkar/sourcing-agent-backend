import { Request, Response, NextFunction } from 'express';
import { startCallRequestSchema, StartCallResponse } from '../../types/api.types';
import { callService } from '../../services/call.service';
import { AppError } from '../../utils/error.utils';

export const startCall = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const requestId = (req as any).requestId;

    // Validate request
    const validationResult = startCallRequestSchema.safeParse(req.body);
    if (!validationResult.success) {
      throw new AppError(
        'Invalid request payload',
        400,
        'VALIDATION_ERROR',
        validationResult.error.issues,
      );
    }

    const callData = validationResult.data;

    // Initiate call
    await callService.initiateCall(callData, requestId);

    const response: StartCallResponse = {
      status: 'success',
      call_id: requestId,
      message: 'Call initiated',
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
