import React from "react";
import { ActivityIndicator, View } from "react-native";
import ScannerScreen from "./ScannerScreen";
import SelectStoreFirstScreen from "./SelectStoreFirstScreen";
import { useStore } from "../context/StoreContext";

export default function ScannerGateScreen({ navigation }) {
  const { selectedStore, storeLoading } = useStore();

  if (storeLoading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // ✅ If no store, show select store first screen
  if (!selectedStore) {
    return <SelectStoreFirstScreen navigation={navigation} />;
  }

  // ✅ store selected → open Scanner
  return <ScannerScreen navigation={navigation} />;
}
