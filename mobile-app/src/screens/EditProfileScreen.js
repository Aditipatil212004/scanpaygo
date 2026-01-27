import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  ScrollView,
  ActivityIndicator,
  Platform,
  StatusBar,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

import { updateProfile } from "../services/userService";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function EditProfileScreen({ navigation }) {
  const { user, updateUser } = useAuth();
  const { colors, mode } = useTheme();

  const [phone, setPhone] = useState(user?.phone || "");
  const [dob, setDob] = useState(user?.dob || "");
  const [photo, setPhoto] = useState(user?.photo || "");
  const [saving, setSaving] = useState(false);

  /* ✅ Pick Image (Gallery) */
  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Required", "Please allow gallery permission.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaType.Images,
        quality: 0.7,
        allowsEditing: true,
        aspect: [1, 1],
      });

      if (!result.canceled) {
        setPhoto(result.assets[0].uri);
      }
    } catch (err) {
      console.log("Image Picker Error:", err);
      Alert.alert("Error", "Could not open gallery");
    }
  };

  /* ✅ Save Profile */
  const saveProfile = async () => {
    try {
      if (phone && phone.length < 10) {
        Alert.alert("Invalid Phone", "Enter valid 10 digit phone number.");
        return;
      }

      setSaving(true);

      const res = await updateProfile({ phone, dob, photo });

      setSaving(false);

      if (!res.ok) {
        Alert.alert("Update Failed", res.message || "Something went wrong");
        return;
      }

      await updateUser(res.user);

      Alert.alert("✅ Updated", "Profile updated successfully!");
      navigation.goBack();
    } catch (e) {
      setSaving(false);
      Alert.alert("Error", "Update failed");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <StatusBar barStyle={mode === "dark" ? "light-content" : "dark-content"} />

      <ScrollView
        style={{ flex: 1, backgroundColor: colors.bg }}
        contentContainerStyle={{ paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ✅ Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={[
              styles.backBtn,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </TouchableOpacity>

          <Text style={[styles.title, { color: colors.text }]}>Edit Profile</Text>
        </View>

        {/* ✅ Profile Photo */}
        <View style={{ alignItems: "center", marginTop: 10 }}>
          <TouchableOpacity
            style={[
              styles.avatarWrap,
              { borderColor: colors.border, backgroundColor: colors.card },
            ]}
            onPress={pickImage}
            activeOpacity={0.9}
          >
            {photo ? (
              <Image source={{ uri: photo }} style={styles.avatarImg} />
            ) : (
              <View style={[styles.avatarEmpty, { backgroundColor: colors.soft }]}>
                <Ionicons name="person" size={38} color={colors.text} />
              </View>
            )}

            <View style={styles.editIcon}>
              <Ionicons name="camera" size={16} color="#fff" />
            </View>
          </TouchableOpacity>

          {/* ✅ Change Photo Button */}
          <TouchableOpacity
            style={[styles.changeBtn, { backgroundColor: colors.primary }]}
            onPress={pickImage}
            activeOpacity={0.9}
          >
            <Ionicons name="image-outline" size={18} color="#fff" />
            <Text style={styles.changeText}>Change Photo</Text>
          </TouchableOpacity>
        </View>

        {/* ✅ Inputs */}
        <Text style={[styles.label, { color: colors.text }]}>Phone Number</Text>
        <View
          style={[
            styles.inputBox,
            {
              borderColor: colors.border,
              backgroundColor: colors.soft,
            },
          ]}
        >
          <Ionicons name="call-outline" size={18} color={colors.primary} />
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder="Enter phone number"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
            maxLength={10}
            placeholderTextColor={colors.muted}
          />
        </View>

        <Text style={[styles.label, { color: colors.text }]}>Date of Birth</Text>
        <View
          style={[
            styles.inputBox,
            {
              borderColor: colors.border,
              backgroundColor: colors.soft,
            },
          ]}
        >
          <Ionicons name="calendar-outline" size={18} color={colors.primary} />
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder="Ex: 21 Apr 2004"
            value={dob}
            onChangeText={setDob}
            placeholderTextColor={colors.muted}
          />
        </View>

        {/* ✅ Save Button */}
        <TouchableOpacity
          style={[
            styles.saveBtn,
            { backgroundColor: colors.primary },
            saving && { opacity: 0.7 },
          ]}
          onPress={saveProfile}
          activeOpacity={0.9}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveText}>Save Changes</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ✅ Styles */
const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 18,
    paddingTop: Platform.OS === "android" ? 16 : 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    fontSize: 22,
    fontWeight: "900",
  },

  avatarWrap: {
    marginTop: 16,
    borderRadius: 60,
    padding: 4,
    borderWidth: 1,
  },

  avatarImg: {
    width: 112,
    height: 112,
    borderRadius: 56,
  },

  avatarEmpty: {
    width: 112,
    height: 112,
    borderRadius: 56,
    alignItems: "center",
    justifyContent: "center",
  },

  editIcon: {
    position: "absolute",
    bottom: 6,
    right: 6,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#16A34A",
    alignItems: "center",
    justifyContent: "center",
  },

  changeBtn: {
    flexDirection: "row",
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 14,
    marginTop: 14,
    alignItems: "center",
  },

  changeText: {
    color: "#fff",
    fontWeight: "900",
  },

  label: {
    marginTop: 20,
    marginBottom: 8,
    fontWeight: "900",
    fontSize: 13,
    paddingHorizontal: 18,
  },

  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginHorizontal: 18,
  },

  input: {
    flex: 1,
    marginLeft: 10,
    fontWeight: "800",
  },

  saveBtn: {
    marginTop: 28,
    marginHorizontal: 18,
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
  },

  saveText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 16,
  },
});
