import {
  BaseAuthError,
  EmailAlreadyInUseException,
  InvalidCredentialsException,
  InvalidEmailException,
  NetworkException,
  TokenExpiredException,
  UserNotFoundException,
  WeakPasswordException,
} from ".";

export class ErrorMapper {
  static mapFirebaseError(error: any): BaseAuthError {
    const errorCode = error.code || "";
    const errorMessage = error.message || "An unknown error occurred";

    // Map Firebase error codes to custom exceptions
    switch (errorCode) {
      case "auth/wrong-password":
      case "auth/invalid-credential":
        return new InvalidCredentialsException(undefined, error);

      case "auth/user-not-found":
        return new UserNotFoundException(undefined, error);

      case "auth/email-already-in-use":
        return new EmailAlreadyInUseException(undefined, error);

      case "auth/weak-password":
        return new WeakPasswordException(
          "Password should be at least 6 characters",
          error,
        );

      case "auth/invalid-email":
        return new InvalidEmailException(undefined, error);

      case "auth/network-request-failed":
      case "auth/timeout":
        return new NetworkException(
          "Network connection failed. Please check your internet",
          error,
        );

      case "auth/id-token-expired":
      case "auth/user-token-expired":
        return new TokenExpiredException(undefined, error);

      case "auth/too-many-requests":
        return new BaseAuthError(
          "Too many requests. Please try again later",
          "TOO_MANY_REQUESTS",
          error,
        );

      case "auth/user-disabled":
        return new BaseAuthError(
          "This account has been disabled",
          "USER_DISABLED",
          error,
        );

      case "auth/operation-not-allowed":
        return new BaseAuthError(
          "This operation is not allowed",
          "OPERATION_NOT_ALLOWED",
          error,
        );

      default:
        return new BaseAuthError(
          errorMessage || "An authentication error occurred",
          "UNKNOWN_ERROR",
          error,
        );
    }
  }

  static isNetworkError(error: any): boolean {
    return error instanceof NetworkException;
  }

  static isTokenError(error: any): boolean {
    return error instanceof TokenExpiredException;
  }
}
