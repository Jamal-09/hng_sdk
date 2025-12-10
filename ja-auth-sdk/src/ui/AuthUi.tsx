import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../context/AuthContext";

type AuthMode = "signin" | "signup" | "reset";

export const AuthScreen: React.FC<{
  onAuthSuccess?: (user: any) => void;
}> = ({ onAuthSuccess }) => {
  const { signIn, signUp, resetPassword, config, error } = useAuth();

  const [mode, setMode] = useState<AuthMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);

  const theme = config.ui?.theme || "light";
  const primaryColor = config.ui?.primaryColor || "#007AFF";
  const isDark = theme === "dark";

  const handleEmailAuth = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      let result;
      if (mode === "signin") {
        result = await signIn.emailPassword(email, password);
      } else if (mode === "signup") {
        result = await signUp(email, password, displayName);
      } else {
        await resetPassword(email);
        Alert.alert("Success", "Password reset email sent!");
        setMode("signin");
        setLoading(false);
        return;
      }

      if (result.success && result.user) {
        onAuthSuccess?.(result.user);
      } else if (result.error) {
        Alert.alert("Authentication Error", result.error.message);
      }
    } catch (err: any) {
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!config.providers.google?.enabled) {
      return;
    }

    setLoading(true);
    try {
      const result = await signIn.google();
      if (result.success && result.user) {
        onAuthSuccess?.(result.user);
      } else if (result.error) {
        Alert.alert("Google Sign-In Error", result.error.message);
      }
    } catch (err: any) {
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    if (!config.providers.apple?.enabled) {
      return;
    }

    setLoading(true);
    try {
      const result = await signIn.apple();
      if (result.success && result.user) {
        onAuthSuccess?.(result.user);
      } else if (result.error) {
        Alert.alert("Apple Sign-In Error", result.error.message);
      }
    } catch (err: any) {
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  const styles = getStyles(isDark, primaryColor);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formContainer}>
          {config.ui?.logo && (
            <Image
              source={config.ui.logo}
              style={styles.logo}
              resizeMode="contain"
            />
          )}

          <Text style={styles.title}>
            {mode === "signin" && "Welcome Back"}
            {mode === "signup" && "Create Account"}
            {mode === "reset" && "Reset Password"}
          </Text>

          {mode === "signup" && (
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor={isDark ? "#888" : "#999"}
              value={displayName}
              onChangeText={setDisplayName}
              autoCapitalize="words"
            />
          )}

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={isDark ? "#888" : "#999"}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          {mode !== "reset" && (
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={isDark ? "#888" : "#999"}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
            />
          )}

          {error && <Text style={styles.errorText}>{error.message}</Text>}

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleEmailAuth}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>
                {mode === "signin" && "Sign In"}
                {mode === "signup" && "Sign Up"}
                {mode === "reset" && "Send Reset Email"}
              </Text>
            )}
          </TouchableOpacity>

          {mode === "signin" && (
            <TouchableOpacity onPress={() => setMode("reset")}>
              <Text style={styles.linkText}>Forgot Password?</Text>
            </TouchableOpacity>
          )}

          {mode !== "reset" && (
            <>
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OR</Text>
                <View style={styles.dividerLine} />
              </View>

              {config.providers.google?.enabled && (
                <TouchableOpacity
                  style={styles.socialButton}
                  onPress={handleGoogleSignIn}
                  disabled={loading}
                >
                  <Text style={styles.socialButtonText}>
                    Continue with Google
                  </Text>
                </TouchableOpacity>
              )}

              {config.providers.apple?.enabled && (
                <TouchableOpacity
                  style={[styles.socialButton, styles.appleButton]}
                  onPress={handleAppleSignIn}
                  disabled={loading}
                >
                  <Text style={styles.socialButtonText}>
                    Continue with Apple
                  </Text>
                </TouchableOpacity>
              )}
            </>
          )}

          <View style={styles.footer}>
            {mode === "signin" && (
              <Text style={styles.footerText}>
                Don't have an account?{" "}
                <Text style={styles.linkText} onPress={() => setMode("signup")}>
                  Sign Up
                </Text>
              </Text>
            )}
            {mode === "signup" && (
              <Text style={styles.footerText}>
                Already have an account?{" "}
                <Text style={styles.linkText} onPress={() => setMode("signin")}>
                  Sign In
                </Text>
              </Text>
            )}
            {mode === "reset" && (
              <Text style={styles.footerText}>
                Remember your password?{" "}
                <Text style={styles.linkText} onPress={() => setMode("signin")}>
                  Sign In
                </Text>
              </Text>
            )}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const getStyles = (isDark: boolean, primaryColor: string) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? "#000" : "#fff",
    },
    scrollContent: {
      flexGrow: 1,
      justifyContent: "center",
      padding: 20,
    },
    formContainer: {
      width: "100%",
      maxWidth: 400,
      alignSelf: "center",
    },
    logo: {
      width: 120,
      height: 120,
      alignSelf: "center",
      marginBottom: 30,
    },
    title: {
      fontSize: 28,
      fontWeight: "bold",
      color: isDark ? "#fff" : "#000",
      marginBottom: 30,
      textAlign: "center",
    },
    input: {
      backgroundColor: isDark ? "#1a1a1a" : "#f5f5f5",
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      fontSize: 16,
      color: isDark ? "#fff" : "#000",
      borderWidth: 1,
      borderColor: isDark ? "#333" : "#e0e0e0",
    },
    button: {
      backgroundColor: primaryColor,
      borderRadius: 12,
      padding: 16,
      alignItems: "center",
      marginTop: 10,
    },
    buttonDisabled: {
      opacity: 0.6,
    },
    buttonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "600",
    },
    linkText: {
      color: primaryColor,
      fontSize: 14,
      fontWeight: "600",
      textAlign: "center",
      marginTop: 16,
    },
    errorText: {
      color: "#ff3b30",
      fontSize: 14,
      marginBottom: 10,
      textAlign: "center",
    },
    divider: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: 24,
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: isDark ? "#333" : "#e0e0e0",
    },
    dividerText: {
      color: isDark ? "#888" : "#999",
      paddingHorizontal: 16,
      fontSize: 14,
    },
    socialButton: {
      backgroundColor: isDark ? "#1a1a1a" : "#fff",
      borderRadius: 12,
      padding: 16,
      alignItems: "center",
      marginBottom: 12,
      borderWidth: 1,
      borderColor: isDark ? "#333" : "#e0e0e0",
    },
    appleButton: {
      backgroundColor: "#000",
      borderColor: "#000",
    },
    socialButtonText: {
      color: isDark ? "#fff" : "#000",
      fontSize: 16,
      fontWeight: "600",
    },
    footer: {
      marginTop: 24,
      alignItems: "center",
    },
    footerText: {
      color: isDark ? "#888" : "#666",
      fontSize: 14,
    },
  });
