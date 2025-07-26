import { Picker } from "@react-native-picker/picker";
import React, { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    View
} from "react-native";

import loanData, { Loan, RegionKey, SectorKey } from "../../constants/loans";

const sectors: { key: SectorKey | ""; label: string }[] = [
  { key: "", label: "-- Select Sector --" },
  { key: "manufacturing", label: "Manufacturing" },
  { key: "agriculture", label: "Agriculture & Allied" },
  { key: "services", label: "Services" },
  { key: "retail", label: "Retail & Trade" },
  { key: "technology", label: "Technology" },
  { key: "woman", label: "Women Entrepreneurs" },
];

const regions: { key: RegionKey; label: string }[] = [
  { key: "APAC", label: "APAC" },
  { key: "US", label: "US" },
  { key: "Germany", label: "Germany" },
];

const LoanOptions = () => {
  const [selectedRegion, setSelectedRegion] = useState<RegionKey>("APAC");
  const [selectedSector, setSelectedSector] = useState<SectorKey | "">("");

  // Get loans based on both region & sector selected
  const loans: Loan[] =
    selectedSector && selectedRegion
      ? loanData[selectedRegion][selectedSector] || []
      : [];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>MSME Loan Options</Text>

      <View style={styles.pickerGroup}>
        <View style={styles.pickerContainer}>
          <Text style={styles.label}>Select Region:</Text>
          <Picker
            selectedValue={selectedRegion}
            onValueChange={(val) => setSelectedRegion(val)}
            style={styles.picker}
            mode="dropdown"
          >
            {regions.map((region) => (
              <Picker.Item key={region.key} label={region.label} value={region.key} />
            ))}
          </Picker>
        </View>

        <View style={styles.pickerContainer}>
          <Text style={styles.label}>Select Sector:</Text>
          <Picker
            selectedValue={selectedSector}
            onValueChange={(val) => setSelectedSector(val)}
            style={styles.picker}
            mode="dropdown"
          >
            {sectors.map((sector) => (
              <Picker.Item key={sector.key} label={sector.label} value={sector.key} />
            ))}
          </Picker>
        </View>
      </View>

      <ScrollView style={styles.loanList}>
        {selectedSector === "" ? (
          <Text style={styles.message}>Please select a sector to view loan options.</Text>
        ) : loans.length === 0 ? (
          <Text style={styles.message}>No loan options available for the selected sector and region.</Text>
        ) : (
          loans.map((loan, idx) => (
            <View key={idx} style={styles.loanBox}>
              <Text style={styles.loanName}>{loan.name}</Text>
              <Text style={styles.loanDetails}>{loan.details}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

export default LoanOptions;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    maxWidth: 460,
    marginHorizontal: "auto",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 18,
    shadowColor: "#22577a",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 3,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    color: "#22577a",
    marginBottom: 20,
  },
  pickerGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  pickerContainer: {
    flex: 1,
    marginHorizontal: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
  },
  picker: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
  },
  loanList: {
    marginTop: 10,
  },
  loanBox: {
    backgroundColor: "#eafaff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 14,
    shadowColor: "#22577a",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 1,
  },
  loanName: {
    fontWeight: "700",
    fontSize: 16,
    marginBottom: 6,
    color: "#22577a",
  },
  loanDetails: {
    fontSize: 14,
    color: "#444",
  },
  message: {
    fontStyle: "italic",
    color: "#666",
    textAlign: "center",
    marginTop: 20,
  },
});