# Ja Auth SDK

A Firebase Authentication SDK for React Native with **pre-built UI** and **headless mode** support. Built with TypeScript.

[![npm version](https://badge.fury.io/js/ja-auth-sdk.svg)](https://www.npmjs.com/package/ja-auth-sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 🎨 **Pre-built UI** - Beautiful, customizable authentication screens
- 🔧 **Headless Mode** - Complete control with hooks-based API
- 🔐 **Multiple Providers** - Email/Password, Google, Apple (extensible)
- 📱 **React Native First** - Optimized for mobile development
- 🎯 **TypeScript** - Full type safety throughout
- ⚡ **Auto Token Refresh** - Automatic token management
- 🚨 **Custom Error Handling** - Clear, actionable error messages
- 🎭 **Theming** - Light/Dark mode support

## Installation

### Step 1: Install the package

```bash
npm install ja-auth-sdk

```

### Step 2: Configure Firebase

Follow the [React Native Firebase setup guide](https://rnfirebase.io/) to configure your Firebase project.

#### iOS Setup

1. Add `GoogleService-Info.plist` to your iOS project
2. Update `ios/Podfile`:

```ruby
pod 'Firebase', :modular_headers => true
pod 'FirebaseCore', :modular_headers => true
pod 'GoogleUtilities', :modular_headers => true
```

3. Run `cd ios && pod install`

#### Android Setup

1. Add `google-services.json` to `android/app/`
2. Update `android/build.gradle`:

```gradle
dependencies {
    classpath 'com.google.gms:google-services:4.3.15'
}
```

3. Update `android/app/build.gradle`:

```gradle
apply plugin: 'com.google.gms.google-services'
```

#### Expo Setup

1. Add `google-services.json` to the root

2. Update `app.json`:

```json
{
  "android": {
    "googleServicesFile": "./google-services.json"
  },
  "ios": {
    "googleServicesFile": "./GoogleService-Info.plist"
  },
  "plugins": ["@react-native-firebase/app", "@react-native-firebase/auth"]
}
```

3. Run `npx expo prebuild --clean`

### Step 4: Provider-Specific Setup

#### Google Sign-In

Configure Google Sign-In following the [@react-native-google-signin/google-signin documentation](https://github.com/react-native-google-signin/google-signin).

#### Apple Sign-In (iOS only)

1. Enable Apple Sign-In in Xcode: `Signing & Capabilities` > `+ Capability` > `Sign In with Apple`
2. Follow [@invertase/react-native-apple-authentication setup](https://github.com/invertase/react-native-apple-authentication).

---

## Quick Start

### Option 1: Pre-built UI (Recommended for Quick Setup)

```tsx
import React from "react";
import { SafeAreaView } from "react-native";
import { AuthProvider } from "ja-auth-sdk";
import { AuthScreen } from "ja-auth-sdk/ui";

const authConfig = {
  firebase: {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
  },
  providers: {
    emailPassword: {
      enabled: true,
      requireEmailVerification: false,
    },
    google: {
      enabled: true,
      webClientId: "YOUR_WEB_CLIENT_ID.apps.googleusercontent.com",
    },
    apple: {
      enabled: true,
    },
  },
  ui: {
    theme: "light",
    primaryColor: "#fff",
    // logo: require('./assets/logo.png'), // Optional
  },
};

const App = () => {
  return (
    <AuthProvider config={authConfig}>
      <SafeAreaView style={{ flex: 1 }}>
        <AuthScreen
          onAuthSuccess={(user) => {
            console.log("User signed in:", user);
          }}
        />
      </SafeAreaView>
    </AuthProvider>
  );
};

export default App;
```

### Option 2: Headless Mode (Full Customization)

```tsx
import React, { useState } from "react";
import { View, TextInput, Button, Text } from "react-native";
import { AuthProvider, useAuth } from "ja-auth-sdk";

const LoginScreen = () => {
  const { signIn, authState, user, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const result = await signIn.emailPassword(email, password);
    if (result.success) {
      console.log("Logged in:", result.user);
    }
  };

  if (authState === "Authenticated") {
    return <Text>Welcome {user?.email}!</Text>;
  }

  return (
    <View>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {error && <Text style={{ color: "red" }}>{error.message}</Text>}
      <Button title="Sign In" onPress={handleLogin} />
      <Button title="Google Sign-In" onPress={() => signIn.google()} />
      <Button title="Apple Sign-In" onPress={() => signIn.apple()} />
    </View>
  );
};

const App = () => (
  <AuthProvider config={authConfig}>
    <LoginScreen />
  </AuthProvider>
);
```

## API Reference

### `<AuthProvider>`

Wrap your app with `AuthProvider` to enable authentication.

**Props:**

| Prop       | Type         | Required | Description                  |
| ---------- | ------------ | -------- | ---------------------------- |
| `config`   | `AuthConfig` | Yes      | Authentication configuration |
| `children` | `ReactNode`  | Yes      | Child components             |

### `useAuth()` Hook

Returns authentication state and methods.

**Returns:**

```typescript
{
  // State
  authState: "Authenticated" | "Unauthenticated" | "TokenExpired" | "Loading";
  user: AuthUser | null;
  error: AuthError | null;

  // Sign In Methods
  signIn: {
    emailPassword: (email: string, password: string) => Promise<SignInResult>;
    google: () => Promise<SignInResult>;
    apple: () => Promise<SignInResult>;
  }

  // Sign Up
  signUp: (email: string, password: string, displayName?: string) =>
    Promise<SignInResult>;

  // Other Methods
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  refreshToken: () => Promise<string | null>;
  sendEmailVerification: () => Promise<void>;
}
```

### `AuthConfig` Interface

```typescript
interface AuthConfig {
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
    theme?: "light" | "dark" | "auto";
    logo?: ImageSourcePropType;
    primaryColor?: string;
  };
  callbacks?: {
    onAuthStateChanged?: (state: AuthState, user: AuthUser | null) => void;
    onError?: (error: AuthError) => void;
  };
}
```

### `AuthUser` Interface

```typescript
interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  providerId: string;
  createdAt: string;
}
```

## Error Handling

The SDK provides custom error types for better error handling:

### Error Types

| Error Class                   | Code                   | Description           |
| ----------------------------- | ---------------------- | --------------------- |
| `InvalidCredentialsException` | `INVALID_CREDENTIALS`  | Wrong email/password  |
| `UserNotFoundException`       | `USER_NOT_FOUND`       | Account doesn't exist |
| `EmailAlreadyInUseException`  | `EMAIL_ALREADY_IN_USE` | Email is taken        |
| `WeakPasswordException`       | `WEAK_PASSWORD`        | Password too weak     |
| `TokenExpiredException`       | `TOKEN_EXPIRED`        | Auth token expired    |
| `NetworkException`            | `NETWORK_ERROR`        | Network failure       |
| `InvalidEmailException`       | `INVALID_EMAIL`        | Invalid email format  |
| `EmailNotVerifiedException`   | `EMAIL_NOT_VERIFIED`   | Email not verified    |

### Error Handling Example

```typescript
import { InvalidCredentialsException, NetworkException } from "ja-auth-sdk";

const handleLogin = async () => {
  try {
    const result = await signIn.emailPassword(email, password);
    if (!result.success && result.error) {
      if (result.error instanceof InvalidCredentialsException) {
        Alert.alert("Login Failed", "Invalid email or password");
      } else if (result.error instanceof NetworkException) {
        Alert.alert("Network Error", "Please check your connection");
      } else {
        Alert.alert("Error", result.error.message);
      }
    }
  } catch (error) {
    console.error("Unexpected error:", error);
  }
};
```

### Global Error Callback

```typescript
const authConfig = {
  // ...
  callbacks: {
    onError: (error) => {
      // Log to analytics, show toast, etc.
      console.error("Auth Error:", error.code, error.message);
    },
  },
};
```

---

## UI Customization

### Theme

```typescript
const authConfig = {
  // ...
  ui: {
    theme: "dark", // 'light' | 'dark' | 'auto'
    primaryColor: "#FF6B6B",
    logo: require("./assets/my-logo.png"),
  },
};
```

### Custom Styling

For complete UI control, use the headless mode and build your own components.

---

## Security Best Practices

### 1. Secure Token Storage

The SDK automatically handles token storage

### 2. Email Verification

```typescript
const authConfig = {
  providers: {
    emailPassword: {
      enabled: true,
      requireEmailVerification: true, // Enforce verification
    },
  },
};
```

### 3. Token Refresh

Tokens are automatically refreshed. To manually refresh:

```typescript
const { refreshToken } = useAuth();

const newToken = await refreshToken();
```

### 4. Handle Token Expiration

```typescript
const { authState } = useAuth();

if (authState === "TokenExpired") {
  // Prompt re-authentication
  await signOut();
  // Show login screen
}
```

## Example Flows

### Complete Sign-Up Flow

```typescript
const SignUpScreen = () => {
  const { signUp, sendEmailVerification } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSignUp = async () => {
    const result = await signUp(email, password, name);

    if (result.success) {
      await sendEmailVerification();
      Alert.alert(
        'Success',
        'Please check your email to verify your account'
      );
    }
  };

  return (/* UI */);
};
```

### Password Reset Flow

```typescript
const ForgotPasswordScreen = () => {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');

  const handleReset = async () => {
    try {
      await resetPassword(email);
      Alert.alert('Success', 'Password reset email sent!');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (/* UI */);
};
```

### State Monitoring

```typescript
const authConfig = {
  // ...
  callbacks: {
    onAuthStateChanged: (state, user) => {
      if (state === "Authenticated") {
        // Navigate to home
        navigation.navigate("Home");
      } else if (state === "Unauthenticated") {
        // Navigate to login
        navigation.navigate("Login");
      } else if (state === "TokenExpired") {
        Alert.alert("Session Expired", "Please sign in again");
      }
    },
  },
};
```

## Advanced Usage

### Custom Auth Backend

```typescript
// Use with your custom backend
const { user, refreshToken } = useAuth();

const token = await refreshToken();
const response = await fetch("https://your-api.com/protected", {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
```

## Troubleshooting

### Common Issues

#### "Google Sign-In not working"

**Solution:**

1. Verify `webClientId` is correct (from Firebase Console > Project Settings > General)
2. Add SHA-1 fingerprint to Firebase Console (Android)
3. Rebuild your app after changes

#### "Token Expired" state persists

**Solution:**

```typescript
const { signOut, refreshToken } = useAuth();

const newToken = await refreshToken();

if (!newToken) {
  // Force sign out and re-authenticate
  await signOut();
}
```

## Additional Resources

- [Firebase Authentication Docs](https://firebase.google.com/docs/auth)
- [React Native Firebase](https://rnfirebase.io/)
- [API Documentation](./docs/API.md)
- [Error Codes Reference](./docs/ERRORS.md)

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

### Development Setup

```bash
git clone https://github.com/ikennarichard/ja-auth-sdk.git
cd ja-auth-sdk
npm install
npm run build
```

## Acknowledgments

- Firebase team for the amazing authentication service
- React Native Firebase for the native SDK wrapper
- All contributors to this project
