import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: "absolute",
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="onboardingscreens"
        options={{
          href: null, // ✅ prevents it from appearing in the tab bar
        }}
      />
      <Tabs.Screen
        name="accountdetailsscreen"
        options={{
          title: "Account",
          tabBarIcon: ({ color }) => (
            <IconSymbol
              size={28}
              name="person.crop.circle.fill"
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="SpendAnalyzer"
        options={{
          title: "Spend Analyzer",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="chart.pie.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="FinancialLiteracyScreen"
        options={{
          href: null, // ✅ prevents it from appearing in the tab bar
        }}
      />
      <Tabs.Screen
        name="MSME"
        options={{
          href: null, // ✅ prevents it from appearing in the tab bar
        }}
      />
      <Tabs.Screen
        name="learn"
        options={{
          href: null, // ✅ prevents it from appearing in the tab bar
        }}
      />
    </Tabs>
  );
}
