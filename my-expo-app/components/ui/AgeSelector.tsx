import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

const AgeSelector = ({
  onSelect,
  teenLabel,
  elderLabel,
  title,
}: {
  onSelect: (group: "teen" | "elder") => void;
  teenLabel: string;
  elderLabel: string;
  title: string;
}) => {
  return (
    <View style={{ alignItems: "center", marginTop: 50 }}>
      <Text style={{ fontSize: 22, marginBottom: 20, fontWeight: "600" }}>
        {title}
      </Text>
      <TouchableOpacity
        onPress={() => onSelect("teen")}
        style={{
          backgroundColor: "#202868",
          paddingVertical: 15,
          paddingHorizontal: 60,
          borderRadius: 10,
          marginVertical: 8,
          width: "70%",
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#fff", fontSize: 18 }}>{teenLabel}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => onSelect("elder")}
        style={{
          backgroundColor: "#202868",
          paddingVertical: 15,
          paddingHorizontal: 60,
          borderRadius: 10,
          marginVertical: 8,
          width: "70%",
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#fff", fontSize: 18 }}>{elderLabel}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AgeSelector;