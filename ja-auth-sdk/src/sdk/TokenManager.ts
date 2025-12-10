import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { TokenExpiredException } from "../errors";

export class TokenManager {
  private static instance: TokenManager;
  private refreshTimer: NodeJS.Timeout | null = null;

  private constructor() {}

  static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager();
    }
    return TokenManager.instance;
  }

  async getIdToken(forceRefresh = false): Promise<string | null> {
    try {
      const user = auth().currentUser;
      if (!user) {
        return null;
      }

      const token = await user.getIdToken(forceRefresh);
      return token;
    } catch (error) {
      throw new TokenExpiredException(undefined, error);
    }
  }

  async refreshToken(): Promise<string | null> {
    return this.getIdToken(true);
  }

  startAutoRefresh(intervalMs = 3000000) {
    // 50 minutes
    this.stopAutoRefresh();

    this.refreshTimer = setInterval(async () => {
      try {
        await this.refreshToken();
      } catch (error) {
        console.error("Token refresh failed:", error);
      }
    }, intervalMs);
  }

  stopAutoRefresh() {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
      this.refreshTimer = null;
    }
  }

  async getTokenClaims(): Promise<Record<string, any> | null> {
    try {
      const user = auth().currentUser;
      if (!user) {
        return null;
      }

      const result = await user.getIdTokenResult();
      return result.claims;
    } catch (error) {
      console.error("Failed to get token claims:", error);
      return null;
    }
  }

  isTokenExpired(token: FirebaseAuthTypes.IdTokenResult): boolean {
    const expirationTime = new Date(token.expirationTime).getTime();
    return Date.now() >= expirationTime;
  }
}
