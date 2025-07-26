import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

// Main Navigation Component
export default function LearnScreen() {
  // Keep track of selected tab by its key/id
  const [selectedTab, setSelectedTab] = useState("dashboard");
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Learn</Text>
            <Text style={styles.subtitle}>Financial Education</Text>
          </View>

          <TouchableOpacity style={styles.notification}>
            <Feather name="bell" size={20} color="black" />
            <View style={styles.badge} />
          </TouchableOpacity>
        </View>

        {/* Main Navigation Buttons */}
        <View style={styles.navGroup}>
          <NavButton
            icon="user"
            title="Financial Literacy"
            subtitle="Understand the basics of money management"
            selected={selectedTab === "dashboard"}
            onPress={() => {
              setSelectedTab("dashboard");
              router.replace("/(tabs)/MSME");
            }}
          />
          <NavButton
            icon="home"
            title="Gamification"
            subtitle="Interactive challenges to boost financial skills"
            selected={selectedTab === "getstarted"}
            onPress={() => {
              setSelectedTab("getstarted");
              router.replace("/(tabs)/FinancialLiteracyScreen");
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Navigation Button Component
type NavButtonProps = {
  icon: React.ComponentProps<typeof Feather>["name"];
  title: string;
  subtitle: string;
  selected?: boolean;
  onPress?: () => void;
};

function NavButton({
  icon,
  title,
  subtitle,
  selected = false,
  onPress,
}: NavButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.navButton, selected && styles.highlightButton]}
    >
      <View style={styles.navContent}>
        <View style={[styles.iconWrapper, selected && styles.iconHighlight]}>
          <Feather name={icon} size={20} color={selected ? "#fff" : "#000"} />
        </View>
        <View style={styles.navText}>
          <Text style={[styles.navTitle, selected && { color: "#fff" }]}>
            {title}
          </Text>
          <Text style={[styles.navSubtitle, selected && { color: "#eee" }]}>
            {subtitle}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

// Quick Action Button
type ActionButtonProps = {
  label: string;
};

function ActionButton({ label }: ActionButtonProps) {
  return (
    <TouchableOpacity style={styles.actionButton}>
      <Text style={styles.actionText}>{label}</Text>
    </TouchableOpacity>
  );
}

// Styles
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 13,
    color: "gray",
    marginTop: 2,
  },
  notification: {
    position: "relative",
    padding: 8,
  },
  badge: {
    position: "absolute",
    top: 2,
    right: 2,
    width: 8,
    height: 8,
    backgroundColor: "red",
    borderRadius: 4,
  },
  navGroup: {
    marginBottom: 32,
  },
  navButton: {
    flexDirection: "row",
    padding: 14,
    marginBottom: 12,
    backgroundColor: "#f2f2f2",
    borderRadius: 12,
    alignItems: "center",
  },
  highlightButton: {
    backgroundColor: "#4f46e5",
  },
  navContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconWrapper: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#ddd",
    marginRight: 14,
  },
  iconHighlight: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  navText: {
    flex: 1,
  },
  navTitle: {
    fontSize: 15,
    fontWeight: "600",
  },
  navSubtitle: {
    fontSize: 12,
    color: "gray",
  },
  quickActions: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  quickTitle: {
    fontSize: 13,
    color: "gray",
    marginBottom: 10,
    fontWeight: "bold",
  },
  quickGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    flex: 1,
    marginRight: 8,
    padding: 12,
    backgroundColor: "#eee",
    borderRadius: 8,
    alignItems: "center",
  },
  actionText: {
    fontSize: 13,
    fontWeight: "600",
  },
});
