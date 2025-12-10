import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import auth from '@react-native-firebase/auth';
import { AuthConfig, AuthState, AuthUser, SignInResult } from '../types';
import { EmailPasswordProvider } from '../providers/EmailPasswordProvider';
import { GoogleProvider } from '../providers/GoogleProvider';
import { AppleProvider } from '../providers/AppleProvider';
import { TokenManager } from '../sdk/TokenManager';
import { ErrorMapper } from '../errors/errorMapper';
import { BaseAuthError } from '../errors';

interface AuthContextValue {
  authState: AuthState;
  user: AuthUser | null;
  error: BaseAuthError | null;
  signIn: {
    emailPassword: (email: string, password: string) => Promise<SignInResult>;
    google: () => Promise<SignInResult>;
    apple: () => Promise<SignInResult>;
  };
  signUp: (
    email: string,
    password: string,
    displayName?: string,
  ) => Promise<SignInResult>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  refreshToken: () => Promise<string | null>;
  sendEmailVerification: () => Promise<void>;
  config: AuthConfig;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{
  children: React.ReactNode;
  config: AuthConfig;
}> = ({ children, config }) => {
  const [authState, setAuthState] = useState<AuthState>('Loading');
  const [user, setUser] = useState<AuthUser | null>(null);
  const [error, setError] = useState<BaseAuthError | null>(null);

  const [emailProvider] = useState(() =>
    config.providers.emailPassword?.enabled
      ? new EmailPasswordProvider(config.providers.emailPassword)
      : null,
  );

  const [googleProvider] = useState(() =>
    config.providers.google?.enabled && config.providers.google.webClientId
      ? new GoogleProvider({ webClientId: config.providers.google.webClientId })
      : null,
  );

  const [appleProvider] = useState(() =>
    config.providers.apple?.enabled ? new AppleProvider() : null,
  );

  const tokenManager = TokenManager.getInstance();

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        const mappedUser: AuthUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          emailVerified: firebaseUser.emailVerified,
          providerId: firebaseUser.providerData[0]?.providerId || 'unknown',
          createdAt:
            firebaseUser.metadata.creationTime || new Date().toISOString(),
        };

        setUser(mappedUser);
        setAuthState('Authenticated');
        tokenManager.startAutoRefresh();

        config.callbacks?.onAuthStateChanged?.('Authenticated', mappedUser);
      } else {
        setUser(null);
        setAuthState('Unauthenticated');
        tokenManager.stopAutoRefresh();

        config.callbacks?.onAuthStateChanged?.('Unauthenticated', null);
      }
    });

    return () => {
      subscriber();
      tokenManager.stopAutoRefresh();
    };
  }, [config]);

  const handleAuthResult = useCallback(
    async (authFunction: () => Promise<AuthUser>): Promise<SignInResult> => {
      try {
        setError(null);
        const user = await authFunction();
        return { success: true, user };
      } catch (err) {
        const authError =
          err instanceof BaseAuthError
            ? err
            : ErrorMapper.mapFirebaseError(err);

        setError(authError);
        config.callbacks?.onError?.(authError);

        return { success: false, error: authError };
      }
    },
    [config],
  );

  const signIn = {
    emailPassword: (email: string, password: string) =>
      handleAuthResult(() => emailProvider!.signIn(email, password)),

    google: () => handleAuthResult(() => googleProvider!.signIn()),

    apple: () => handleAuthResult(() => appleProvider!.signIn()),
  };

  const signUp = (email: string, password: string, displayName?: string) =>
    handleAuthResult(() => emailProvider!.signUp(email, password, displayName));

  const signOut = async () => {
    try {
      await auth().signOut();
      if (googleProvider) {
        await googleProvider.signOut();
      }
    } catch (err) {
      const authError = ErrorMapper.mapFirebaseError(err);
      setError(authError);
      config.callbacks?.onError?.(authError);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await emailProvider!.sendPasswordResetEmail(email);
    } catch (err) {
      const authError = ErrorMapper.mapFirebaseError(err);
      setError(authError);
      config.callbacks?.onError?.(authError);
    }
  };

  const refreshToken = async () => {
    try {
      return await tokenManager.refreshToken();
    } catch (err) {
      const authError = ErrorMapper.mapFirebaseError(err);
      setError(authError);
      setAuthState('TokenExpired');
      config.callbacks?.onError?.(authError);
      return null;
    }
  };

  const sendEmailVerification = async () => {
    try {
      await emailProvider!.sendEmailVerification();
    } catch (err) {
      const authError = ErrorMapper.mapFirebaseError(err);
      setError(authError);
      config.callbacks?.onError?.(authError);
    }
  };

  const value: AuthContextValue = {
    authState,
    user,
    error,
    signIn,
    signUp,
    signOut,
    resetPassword,
    refreshToken,
    sendEmailVerification,
    config,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
