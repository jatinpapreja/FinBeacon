import FinancialHealthScore from "@/components/FinancialHealthScore";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

const AccountDetailsScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Financial Health Score Card */}
        <View style={styles.card}>
          <FinancialHealthScore />
        </View>

        <View style={styles.card}>
          {/* Grid-like 2-column layout */}
          <View style={styles.row}>
            {/* Balance Card */}
            <View style={styles.tile}>
              <View style={styles.tileContent}>
                <View
                  style={[styles.iconContainer, { backgroundColor: "#d1fae5" }]}
                >
                  <Icon name="dollar-sign" size={20} color="#10b981" />
                </View>
                <View>
                  <Text style={styles.tileLabel}>Asset</Text>
                  <Text style={[styles.tileValue, { color: "#10b981" }]}>
                    $1,250
                  </Text>
                </View>
              </View>
            </View>

            {/* Debt Card */}
            <View style={styles.tile}>
              <View style={styles.tileContent}>
                <View
                  style={[styles.iconContainer, { backgroundColor: "#fef3c7" }]}
                >
                  <Icon name="credit-card" size={20} color="#f59e0b" />
                </View>
                <View>
                  <Text style={styles.tileLabel}>Liability</Text>
                  <Text style={[styles.tileValue, { color: "#ef4444" }]}>
                    $800
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Account Details Card */}
        <View style={styles.card}>
          <Text style={styles.header}>Account Details</Text>

          <View style={styles.infoRow}>
            <View style={[styles.iconBox, { backgroundColor: "#e0f2ff" }]}>
              <Icon name="user" size={20} color="#007bff" />
            </View>
            <View>
              <Text style={styles.label}>Account Holder</Text>
              <Text style={styles.value}>Raj Kumar Sharma</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={[styles.iconBox, { backgroundColor: "#ffe0e6" }]}>
              <Icon name="hash" size={20} color="#ff4d6d" />
            </View>
            <View>
              <Text style={styles.label}>Account ID</Text>
              <Text style={[styles.value, styles.mono]}>ACC123456789</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={[styles.iconBox, { backgroundColor: "#e6ffea" }]}>
              <Icon name="map-pin" size={20} color="#28a745" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Address</Text>
              <Text style={[styles.value, styles.small]}>
                House No. 123, Sector 15, Gurgaon, Haryana - 122001
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.header}>Your Goals</Text>

          {/* Emergency Fund Goal */}
          <View style={styles.goalBlock}>
            <View style={styles.goalRow}>
              <View style={styles.goalLabelRow}>
                <Icon name="target" size={14} color="#2563eb" />
                <Text style={styles.goalTitle}>Emergency Fund</Text>
              </View>
              <Text style={styles.goalAmount}>$250 / $1000</Text>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressIndicator, { width: "25%" }]} />
            </View>
          </View>

          {/* Credit Card Debt Goal */}
          <View style={styles.goalBlock}>
            <View style={styles.goalRow}>
              <View style={styles.goalLabelRow}>
                <Icon name="target" size={14} color="#2563eb" />
                <Text style={styles.goalTitle}>Credit Card Debt</Text>
              </View>
              <Text style={styles.goalAmount}>$800 / $0</Text>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressIndicator, { width: "100%" }]} />
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.header}>Recommended for You</Text>

          {/* Recommendation #1 */}
          <View style={styles.recommendationCard}>
            <View style={[styles.iconBox, { backgroundColor: "#fee2e2" }]}>
              <FontAwesome5 name="piggy-bank" size={20} color="#dc2626" />
            </View>
            <View style={styles.recommendationContent}>
              <View style={styles.recommendationHeader}>
                <Text style={styles.recommendationTitle}>
                  High-Yield Savings Account
                </Text>
                <Icon name="alert-circle" size={16} color="#dc2626" />
              </View>
              <Text style={styles.recommendationText}>
                Earn 4.5% APY on your emergency fund
              </Text>
            </View>
            <TouchableOpacity style={styles.learnMoreButton}>
              <Text style={styles.learnMoreText}>Learn More</Text>
            </TouchableOpacity>
          </View>

          {/* Recommendation #2 */}
          <View style={styles.recommendationCard}>
            <View style={[styles.iconBox, { backgroundColor: "#fef3c7" }]}>
              <Icon name="trending-up" size={20} color="#d97706" />
            </View>
            <View style={styles.recommendationContent}>
              <View style={styles.recommendationHeader}>
                <Text style={styles.recommendationTitle}>
                  Credit Builder Loan
                </Text>
              </View>
              <Text style={styles.recommendationText}>
                Build credit while saving money
              </Text>
            </View>
            <TouchableOpacity style={styles.learnMoreButton}>
              <Text style={styles.learnMoreText}>Learn More</Text>
            </TouchableOpacity>
          </View>

          {/* Recommendation #3 */}
          <View style={styles.recommendationCard}>
            <View style={[styles.iconBox, { backgroundColor: "#dcfce7" }]}>
              <Icon name="book-open" size={20} color="#15803d" />
            </View>
            <View style={styles.recommendationContent}>
              <View style={styles.recommendationHeader}>
                <Text style={styles.recommendationTitle}>
                  Complete Financial Basics Course
                </Text>
              </View>
              <Text style={styles.recommendationText}>
                Learn about budgeting and investing
              </Text>
            </View>
            <TouchableOpacity style={styles.learnMoreButton}>
              <Text style={styles.learnMoreText}>Learn More</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AccountDetailsScreen;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f9fafb",
    flexGrow: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
    marginBottom: 16,
  },
  header: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111",
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  iconBox: {
    padding: 10,
    borderRadius: 10,
    marginRight: 12,
  },
  label: {
    fontSize: 13,
    color: "#6b7280", // muted
    marginBottom: 2,
  },
  value: {
    fontSize: 15,
    fontWeight: "500",
    color: "#111",
  },
  mono: {
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
  },
  small: {
    fontSize: 13,
  },
  scrollContainer: {
    padding: 16,
    backgroundColor: "#f9fafb",
    paddingBottom: 40, // prevent clipping at bottom
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  tile: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  tileContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconContainer: {
    padding: 8,
    borderRadius: 10,
  },
  tileLabel: {
    fontSize: 13,
    color: "#374151", // neutral-700
    marginBottom: 2,
  },
  tileValue: {
    fontSize: 16,
    fontWeight: "700",
  },

  goalBlock: {
    marginBottom: 20,
  },
  goalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  goalLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  goalTitle: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: "500",
    color: "#111827", // text-foreground
  },
  goalAmount: {
    fontSize: 12,
    color: "#6b7280", // muted
  },
  progressBar: {
    height: 8,
    backgroundColor: "#e5e7eb", // bg-secondary
    borderRadius: 10,
    overflow: "hidden",
  },
  progressIndicator: {
    height: "100%",
    backgroundColor: "#2563eb", // primary color
  },
  recommendationCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#d1d5db", // border-border/50
    backgroundColor: "#f9fafb", // bg-background/50
    marginBottom: 12,
  },
  recommendationContent: {
    flex: 1,
  },
  recommendationHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 2,
  },
  recommendationTitle: {
    fontWeight: "600",
    fontSize: 14,
    color: "#111827",
    flexShrink: 1,
  },
  recommendationText: {
    fontSize: 12,
    color: "#6b7280", // muted-foreground
  },
  learnMoreButton: {
    alignSelf: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#d1d5db",
    backgroundColor: "#fff",
  },
  learnMoreText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#2563eb",
  },
});
