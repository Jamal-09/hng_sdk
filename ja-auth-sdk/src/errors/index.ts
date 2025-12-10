export class BaseAuthError extends Error {
  code: string;
  originalError?: any;

  constructor(message: string, code: string, originalError?: any) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.originalError = originalError;
    Object.setPrototypeOf(this, BaseAuthError.prototype);
  }
}

export class InvalidCredentialsException extends BaseAuthError {
  constructor(message = 'Invalid email or password', originalError?: any) {
    super(message, 'INVALID_CREDENTIALS', originalError);
    Object.setPrototypeOf(this, InvalidCredentialsException.prototype);
  }
}

export class UserNotFoundException extends BaseAuthError {
  constructor(message = 'User account does not exist', originalError?: any) {
    super(message, 'USER_NOT_FOUND', originalError);
    Object.setPrototypeOf(this, UserNotFoundException.prototype);
  }
}

export class EmailAlreadyInUseException extends BaseAuthError {
  constructor(
    message = 'Email address is already in use',
    originalError?: any,
  ) {
    super(message, 'EMAIL_ALREADY_IN_USE', originalError);
    Object.setPrototypeOf(this, EmailAlreadyInUseException.prototype);
  }
}

export class WeakPasswordException extends BaseAuthError {
  constructor(message = 'Password is too weak', originalError?: any) {
    super(message, 'WEAK_PASSWORD', originalError);
    Object.setPrototypeOf(this, WeakPasswordException.prototype);
  }
}

export class TokenExpiredException extends BaseAuthError {
  constructor(
    message = 'Authentication token has expired',
    originalError?: any,
  ) {
    super(message, 'TOKEN_EXPIRED', originalError);
    Object.setPrototypeOf(this, TokenExpiredException.prototype);
  }
}

export class NetworkException extends BaseAuthError {
  constructor(message = 'Network error occurred', originalError?: any) {
    super(message, 'NETWORK_ERROR', originalError);
    Object.setPrototypeOf(this, NetworkException.prototype);
  }
}

export class InvalidEmailException extends BaseAuthError {
  constructor(message = 'Invalid email format', originalError?: any) {
    super(message, 'INVALID_EMAIL', originalError);
    Object.setPrototypeOf(this, InvalidEmailException.prototype);
  }
}

export class EmailNotVerifiedException extends BaseAuthError {
  constructor(message = 'Email address not verified', originalError?: any) {
    super(message, 'EMAIL_NOT_VERIFIED', originalError);
    Object.setPrototypeOf(this, EmailNotVerifiedException.prototype);
  }
}
