import API_BASE from "./api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const updateProfile = async ({ phone, dob, photo }) => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) return { ok: false, message: "No token found. Please login again." };

    const formData = new FormData();
    formData.append("phone", phone || "");
    formData.append("dob", dob || "");

    // ✅ If photo selected
    if (photo && photo.startsWith("file")) {
      formData.append("photo", {
        uri: photo,
        name: "profile.jpg",
        type: "image/jpeg",
      });
    }

    const res = await fetch(`${API_BASE}/api/user/update-profile`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        // ❌ DO NOT set Content-Type for FormData
      },
      body: formData,
    });

    const text = await res.text();
    const data = text ? JSON.parse(text) : {};

    if (!res.ok) {
      return { ok: false, message: data?.message || "Update failed" };
    }

    return { ok: true, user: data.user, message: data.message };
  } catch (err) {
    console.log("Update Profile Error:", err.message);
    return { ok: false, message: "Network error" };
  }
};
