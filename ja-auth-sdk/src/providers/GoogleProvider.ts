import auth from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { ErrorMapper } from "../errors/errorMapper";
import { AuthUser } from "../types";

export class GoogleProvider {
  private webClientId: string;
  private isInitialized: boolean = false;

  constructor(config: { webClientId: string }) {
    this.webClientId = config.webClientId;
  }

  private async initialize() {
    if (this.isInitialized) {
      return;
    }

    try {
      GoogleSignin.configure({
        webClientId: this.webClientId,
        offlineAccess: false,
        forceCodeForRefreshToken: true,
        scopes: ["profile", "email"],
      });
      this.isInitialized = true;
      console.log("Google Sign-In configured successfully");
    } catch (error) {
      console.error("Google Sign-In configuration error:", error);
      throw error;
    }
  }

  async signIn(): Promise<AuthUser> {
    try {
      await this.initialize();

      // Check Play Services (Android only)
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      const userInfo = await GoogleSignin.signIn();
      const idToken = (userInfo as any)?.data?.idToken;

      if (!idToken) {
        console.error("No ID token returned");
        throw new Error("No ID token returned from Google Sign-In");
      }
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      console.log("Signing in to Firebase...");
      const result = await auth().signInWithCredential(googleCredential);

      return this.mapToAuthUser(result.user);
    } catch (error: any) {
      console.error("Google Sign-In error:", error);

      if (error.code === "12501") {
        throw new Error("Sign-in cancelled by user");
      }

      if (error.code === "SIGN_IN_CANCELLED") {
        throw new Error("Sign-in cancelled");
      }

      if (error.code === "DEVELOPER_ERROR") {
        throw new Error(
          "DEVELOPER_ERROR: Check SHA-1 fingerprint, package name, and webClientId configuration",
        );
      }

      throw ErrorMapper.mapFirebaseError(error);
    }
  }

  async signOut(): Promise<void> {
    try {
      await GoogleSignin.signOut();
    } catch (error) {
      console.error("Google sign-out error:", error);
    }
  }

  private mapToAuthUser(user: any): AuthUser {
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
      providerId: "google.com",
      createdAt: user.metadata.creationTime || new Date().toISOString(),
    };
  }
}
