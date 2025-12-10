import { AuthProvider, useAuth } from "ja-auth-sdk";
import { AuthScreen } from "ja-auth-sdk/ui";
import React from "react";
import { Button, Image, StatusBar, StyleSheet, Text, View } from "react-native";

const authConfig = {
  firebase: {
    apiKey: "AIzaSyAvEU1EtdXXn_vgCeMAegrg8JxxQwCDluY",
    authDomain: "cartle-auction-house.firebaseapp.com",
    projectId: "cartle-auction-house",
  },
  providers: {
    emailPassword: {
      enabled: true,
      requireEmailVerification: false,
    },
    google: {
      enabled: true,
      webClientId:
        "61325356093-rj6tq3mdgenk8kvm0bvhf2fvm87k7njt.apps.googleusercontent.com",
    },
    apple: {
      enabled: true,
    },
  },
  ui: {
    theme: "light",
    primaryColor: "#007AFF",
  },
  callbacks: {
    onAuthStateChanged: (state: any, user: any) => {
      console.log("Auth state changed:", state, user);
    },
    onError: (error: any) => {
      console.error("Auth error:", error);
    },
  },
};

const AuthenticatedScreen = () => {
  const { user, signOut } = useAuth();
  console.log("User", user);

  return (
    <View style={styles.authenticatedContainer}>
      <View>
        {user?.photoURL ? (
          <Image
            source={{ uri: user?.photoURL as string }}
            width={64}
            height={64}
            style={{
              borderRadius: 32,
              marginBottom: 12,
              marginHorizontal: "auto",
            }}
          />
        ) : (
          <Text>👤</Text>
        )}
        <Text style={styles.welcomeText}>Welcome {user?.displayName}!</Text>
      </View>
      <Text style={styles.emailText}>{user?.email}</Text>
      <Text style={styles.infoText}>UID: {user?.uid}</Text>
      <Text style={[styles.infoText, { marginBottom: 20 }]}>
        Provider: {user?.providerId}
      </Text>
      <Button title="Sign Out" onPress={signOut} />
    </View>
  );
};

const AppContent = () => {
  const { authState, user } = useAuth();

  if (authState === "Loading") {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (authState === "Authenticated" && user) {
    return <AuthenticatedScreen />;
  }

  return (
    <AuthScreen
      onAuthSuccess={(user) => {
        console.log("Authentication successful:", user);
      }}
    />
  );
};

const App = () => {
  return (
    <AuthProvider config={authConfig}>
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <AppContent />
      </View>
    </AuthProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  authenticatedContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  welcomeText: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  emailText: {
    fontSize: 18,
    color: "#666",
    marginBottom: 60,
  },
  infoText: {
    fontSize: 14,
    color: "#999",
    marginBottom: 5,
  },
});

export default App;
