import LoanOptions from "@/components/ui/LoanOptions";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
const LoanOptionsScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={{ flex: 1, backgroundColor: "#f8fafc" }}>
        <LoanOptions />
      </View>
    </SafeAreaView>
  );
};

export default LoanOptionsScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
