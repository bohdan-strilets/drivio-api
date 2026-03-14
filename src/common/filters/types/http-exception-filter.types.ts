import { ErrorCode } from '../../error/error-codes';

export type ErrorResponse = {
  statusCode: number;
  code: ErrorCode | string;
  path: string;
  timestamp: string;
};
