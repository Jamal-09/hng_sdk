import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { EmailNotVerifiedException } from "../errors";
import { ErrorMapper } from "../errors/errorMapper";
import { AuthUser } from "../types";

export class EmailPasswordProvider {
  private requireEmailVerification: boolean;

  constructor(config: { requireEmailVerification?: boolean } = {}) {
    this.requireEmailVerification = config.requireEmailVerification ?? false;
  }

  async signIn(email: string, password: string): Promise<AuthUser> {
    try {
      const result = await auth().signInWithEmailAndPassword(email, password);

      if (this.requireEmailVerification && !result.user.emailVerified) {
        await auth().signOut();
        throw new EmailNotVerifiedException();
      }

      return this.mapToAuthUser(result.user);
    } catch (error) {
      throw ErrorMapper.mapFirebaseError(error);
    }
  }

  async signUp(
    email: string,
    password: string,
    displayName?: string,
  ): Promise<AuthUser> {
    try {
      const result = await auth().createUserWithEmailAndPassword(
        email,
        password,
      );

      if (displayName) {
        await result.user.updateProfile({ displayName });
      }

      if (this.requireEmailVerification) {
        await result.user.sendEmailVerification();
      }

      return this.mapToAuthUser(result.user);
    } catch (error) {
      throw ErrorMapper.mapFirebaseError(error);
    }
  }

  async sendPasswordResetEmail(email: string): Promise<void> {
    try {
      await auth().sendPasswordResetEmail(email);
    } catch (error) {
      throw ErrorMapper.mapFirebaseError(error);
    }
  }

  async sendEmailVerification(): Promise<void> {
    try {
      const user = auth().currentUser;
      if (!user) {
        throw new Error("No user signed in");
      }
      await user.sendEmailVerification();
    } catch (error) {
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
      providerId: "password",
      createdAt: user.metadata.creationTime || new Date().toISOString(),
    };
  }
}
