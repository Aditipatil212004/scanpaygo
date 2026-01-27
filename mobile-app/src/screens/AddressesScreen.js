import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  getAddresses,
  setDefaultAddress,
  deleteAddress,
} from "../services/addressService";
import { useStore } from "../context/StoreContext";
import { useTheme } from "../context/ThemeContext";

export default function AddressesScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState([]);

  const { setStore } = useStore();
  const { colors, mode } = useTheme();

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await getAddresses();
      setLoading(false);

      if (!res.ok) {
        Alert.alert("Error", res.message || "Failed to load addresses");
        return;
      }

      setList(res.addresses || []);
    } catch (e) {
      setLoading(false);
      Alert.alert("Error", "Something went wrong");
    }
  };

  useEffect(() => {
    const unsub = navigation.addListener("focus", loadData);
    return unsub;
  }, [navigation]);

  const makeDefault = async (address) => {
    try {
      await setStore(address);

      const res = await setDefaultAddress(address._id);
      if (!res.ok) {
        Alert.alert(
          "Warning",
          "Store selected in app, but backend update failed."
        );
      }

      Alert.alert("✅ Store Selected", `${address.storeName} selected.`);
      navigation.goBack();
    } catch (e) {
      Alert.alert("Error", "Failed to select store");
    }
  };

  const removeAddress = async (id) => {
    Alert.alert("Delete Address", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const res = await deleteAddress(id);
          if (!res.ok) return Alert.alert("Error", res.message);
          loadData();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.bg }]}>
      <StatusBar barStyle={mode === "dark" ? "light-content" : "dark-content"} />

      <View style={[styles.container, { backgroundColor: colors.bg }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={[
              styles.backBtn,
              { backgroundColor: colors.soft, borderColor: colors.border },
            ]}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={20} color={colors.primary} />
          </TouchableOpacity>

          <Text style={[styles.title, { color: colors.text }]}>Address Book</Text>

          <TouchableOpacity
            style={[styles.addBtn, { backgroundColor: colors.primary }]}
            onPress={() => navigation.navigate("AddAddress")}
          >
            <Ionicons name="add" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          <ScrollView contentContainerStyle={{ paddingBottom: 70 }}>
            {list.length === 0 ? (
              <View style={styles.empty}>
                <Ionicons name="location-outline" size={50} color={colors.primary} />
                <Text style={[styles.emptyTitle, { color: colors.text }]}>
                  No saved addresses
                </Text>
                <Text style={[styles.emptySub, { color: colors.muted }]}>
                  Add your store/mall address to start shopping.
                </Text>

                <TouchableOpacity
                  style={[styles.addBigBtn, { backgroundColor: colors.primary }]}
                  onPress={() => navigation.navigate("AddAddress")}
                >
                  <Text style={styles.addBigText}>Add Address</Text>
                </TouchableOpacity>
              </View>
            ) : (
              list.map((a) => (
                <View
                  key={a._id}
                  style={[
                    styles.card,
                    { backgroundColor: colors.card, borderColor: colors.border },
                  ]}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <View
                      style={[
                        styles.iconBox,
                        {
                          backgroundColor: colors.soft,
                          borderColor: colors.border,
                        },
                      ]}
                    >
                      <Ionicons
                        name="location-outline"
                        size={20}
                        color={colors.primary}
                      />
                    </View>

                    <View style={{ flex: 1 }}>
                      <Text style={[styles.label, { color: colors.text }]}>
                        {a.storeName || a.label}
                      </Text>
                      <Text style={[styles.address, { color: colors.muted }]}>
                        {a.addressLine}
                      </Text>
                    </View>

                    {a.isDefault ? (
                      <View
                        style={[
                          styles.defaultBadge,
                          { backgroundColor: colors.primary },
                        ]}
                      >
                        <Text style={styles.defaultText}>Selected</Text>
                      </View>
                    ) : (
                      <TouchableOpacity onPress={() => makeDefault(a)}>
                        <Text style={[styles.selectText, { color: colors.primary }]}>
                          Select
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>

                  <View style={styles.actions}>
                    <TouchableOpacity
                      style={styles.actionBtn}
                      onPress={() =>
                        navigation.navigate("AddAddress", { edit: a })
                      }
                    >
                      <Ionicons
                        name="create-outline"
                        size={16}
                        color={colors.text}
                      />
                      <Text style={[styles.actionText, { color: colors.text }]}>
                        Edit
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.actionBtn}
                      onPress={() => removeAddress(a._id)}
                    >
                      <Ionicons
                        name="trash-outline"
                        size={16}
                        color={colors.danger}
                      />
                      <Text
                        style={[
                          styles.actionText,
                          { color: colors.danger },
                        ]}
                      >
                        Delete
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },

  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 14,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },

  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "900",
  },

  addBtn: {
    width: 42,
    height: 42,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },

  center: { flex: 1, alignItems: "center", justifyContent: "center" },

  empty: { marginTop: 70, alignItems: "center" },

  emptyTitle: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "900",
  },

  emptySub: {
    marginTop: 6,
    fontWeight: "700",
    textAlign: "center",
  },

  addBigBtn: {
    marginTop: 18,
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 16,
  },

  addBigText: { color: "#fff", fontWeight: "900" },

  card: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
  },

  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  label: { fontSize: 15, fontWeight: "900" },

  address: {
    marginTop: 2,
    fontWeight: "700",
    fontSize: 12,
  },

  defaultBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },

  defaultText: { color: "#fff", fontWeight: "900", fontSize: 12 },

  selectText: { fontWeight: "900" },

  actions: { flexDirection: "row", gap: 14, marginTop: 10, marginLeft: 54 },
  actionBtn: { flexDirection: "row", alignItems: "center", gap: 6 },
  actionText: { fontWeight: "900" },
});
