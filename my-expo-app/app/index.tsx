import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleSignIn = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (username && password) {
        router.replace("/(tabs)");
      } else {
        Alert.alert("Sign In Failed", "Please enter username and password.");
      }
    }, 1000);
  };

  const handleSignUp = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (username && password && email) {
        Alert.alert(
          "Account Created",
          "Welcome, " + username + "! Your account is ready."
        );
        setActiveTab("signin");
      } else {
        Alert.alert("Sign Up Failed", "Please fill all fields.");
      }
    }, 1000);
  };

  const handleForgotPassword = () => {
    Alert.alert(
      "Reset Password",
      "A password reset link will be sent to your email (simulated)."
    );
  };

  return (
    <LinearGradient colors={["#4f46e5", "#6366f1"]} style={styles.container}>
      <View style={styles.card}>
        <View style={styles.tabRow}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "signin" && styles.activeTab,
            ]}
            onPress={() => setActiveTab("signin")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "signin" && styles.activeTabText,
              ]}
            >
              Sign In
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "signup" && styles.activeTab,
            ]}
            onPress={() => setActiveTab("signup")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "signup" && styles.activeTabText,
              ]}
            >
              Create Account
            </Text>
          </TouchableOpacity>
        </View>
        {activeTab === "signin" ? (
          <>
            <Text style={styles.title}>Sign In</Text>
            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor="#aaa"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#aaa"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <TouchableOpacity
              style={styles.button}
              onPress={handleSignIn}
              disabled={loading}
            >
              <LinearGradient
                colors={["#22c55e", "#16a34a"]}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>
                  {loading ? "Signing in..." : "Sign In"}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleForgotPassword}
              style={styles.linkButton}
            >
              <Text style={styles.linkText}>Forgot Password?</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.title}>Create Account</Text>
            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor="#aaa"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#aaa"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#aaa"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <TouchableOpacity
              style={styles.button}
              onPress={handleSignUp}
              disabled={loading}
            >
              <LinearGradient
                colors={["#22c55e", "#16a34a"]}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>
                  {loading ? "Creating..." : "Create Account"}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </>
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  tabRow: {
    flexDirection: "row",
    marginBottom: 18,
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    overflow: "hidden",
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: "#f3f4f6",
  },
  activeTab: {
    backgroundColor: "#e0e7ff",
  },
  tabText: {
    fontSize: 15,
    color: "#4f46e5",
    fontWeight: "600",
  },
  activeTabText: {
    color: "#1e293b",
  },
  linkButton: {
    marginTop: 10,
    alignSelf: "flex-end",
  },
  linkText: {
    color: "#4f46e5",
    fontSize: 14,
    fontWeight: "500",
    textDecorationLine: "underline",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 32,
    width: "90%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4f46e5",
    marginBottom: 24,
  },
  input: {
    width: "100%",
    height: 48,
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#222",
    marginBottom: 16,
  },
  button: {
    width: "100%",
    marginTop: 8,
    borderRadius: 25,
    overflow: "hidden",
  },
  buttonGradient: {
    paddingVertical: 14,
    alignItems: "center",
    borderRadius: 25,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
