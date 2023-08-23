import { EnumStatusCode } from '@wundergraph/cosmo-connect/dist/common_pb';

export class ServiceError extends Error {
  constructor(public code: EnumStatusCode, message: string, cause?: Error) {
    super(message);
    this.name = this.constructor.name;
    this.cause = cause;
  }
}

export class PublicError extends ServiceError {}

export class AuthenticationError extends ServiceError {}

export function isAuthenticationError(e: Error): e is PublicError {
  return e instanceof AuthenticationError;
}

export function isPublicError(e: Error): e is PublicError {
  return e instanceof PublicError;
}