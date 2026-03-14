import { ErrorCode } from './error-codes';

export type ErrorResponse = {
  statusCode: number;
  code: ErrorCode;
  path: string;
  timestamp: string;
};
