import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { ProgressBar } from "react-native-paper";

const FinancialHealthScore = () => {
  const score = 72;
  const status = "Good";

  return (
    <View style={styles.card}>
      {/* Header Row */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>Financial Health Score</Text>
          <Text style={styles.subtitle}>Based on your goals and spending</Text>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Text style={styles.score}>{score}</Text>
          <Text style={styles.scoreLabel}>{status}</Text>
        </View>
      </View>

      {/* Progress Bar */}
      <ProgressBar
        progress={score / 100}
        color="#007bff"
        style={styles.progressBar}
      />

      {/* Score Legend */}
      <View style={styles.legend}>
        <Text style={styles.legendText}>Poor</Text>
        <Text style={styles.legendText}>Fair</Text>
        <Text style={styles.legendText}>Good</Text>
        <Text style={styles.legendText}>Excellent</Text>
      </View>
    </View>
  );
};

export default FinancialHealthScore;
const styles = StyleSheet.create({
  card: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#f8f9fb",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111",
  },
  subtitle: {
    fontSize: 13,
    color: "#6b7280",
  },
  score: {
    fontSize: 28,
    fontWeight: "700",
    color: "#007bff",
  },
  scoreLabel: {
    fontSize: 13,
    color: "#6b7280",
  },
  progressBar: {
    height: 10,
    borderRadius: 10,
    backgroundColor: "#e0e0e0",
  },
  legend: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  legendText: {
    fontSize: 12,
    color: "#6b7280",
  },
});
