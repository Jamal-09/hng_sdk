import { appleAuth } from "@invertase/react-native-apple-authentication";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { ErrorMapper } from "../errors/errorMapper";
import { AuthUser } from "../types";

export class AppleProvider {
  async signIn(): Promise<AuthUser> {
    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });

      if (!appleAuthRequestResponse.identityToken) {
        throw new Error("Apple Sign-In failed - no identity token returned");
      }

      const { identityToken, nonce } = appleAuthRequestResponse;
      const appleCredential = auth.AppleAuthProvider.credential(
        identityToken,
        nonce,
      );

      const result = await auth().signInWithCredential(appleCredential);

      return this.mapToAuthUser(result.user);
    } catch (error: any) {
      if (error.code === appleAuth.Error.CANCELED) {
        throw new Error("Apple Sign-In cancelled");
      }
      throw ErrorMapper.mapFirebaseError(error);
    }
  }

  private mapToAuthUser(user: FirebaseAuthTypes.User): AuthUser {
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
      providerId: "apple.com",
      createdAt: user.metadata.creationTime || new Date().toISOString(),
    };
  }
}
