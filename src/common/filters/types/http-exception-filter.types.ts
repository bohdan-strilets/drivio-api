import { ErrorCode } from '@common/error';

export type ErrorResponse = {
  statusCode: number;
  code: ErrorCode | string;
  path: string;
  timestamp: string;
};
