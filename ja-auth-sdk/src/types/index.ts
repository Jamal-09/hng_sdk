export type AuthState =
  | "Authenticated"
  | "Unauthenticated"
  | "TokenExpired"
  | "Loading";

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  providerId: string;
  createdAt: string;
}

export interface AuthConfig {
  firebase: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket?: string;
    messagingSenderId?: string;
    appId?: string;
  };
  providers: {
    emailPassword?: {
      enabled: boolean;
      requireEmailVerification?: boolean;
    };
    google?: {
      enabled: boolean;
      webClientId: string;
    };
    apple?: {
      enabled: boolean;
    };
  };
  ui?: {
    theme?: "light" | "dark" | "auto" | string;
    logo?: any;
    primaryColor?: string;
  };
  callbacks?: {
    onAuthStateChanged?: (state: AuthState, user: AuthUser | null) => void;
    onError?: (error: AuthError) => void;
  };
}

export interface SignInResult {
  success: boolean;
  user?: AuthUser;
  error?: AuthError;
}

export interface AuthError {
  code: string;
  message: string;
  originalError?: any;
}
