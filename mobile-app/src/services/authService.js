import AsyncStorage from "@react-native-async-storage/async-storage";
import API_BASE from "./api";

// ✅ SIGNUP

export const signupUser = async ({ name, email, password }) => {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000); // 15 sec

    const res = await fetch(`${API_BASE}/api/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    const data = await res.json();
    return data;
  } catch (err) {
    console.log("Signup Error:", err);
    return { ok: false, message: "Server waking up, try again" };
  }
};


// ✅ LOGIN
export const loginUser = async ({ email, password }) => {
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    // If login successful -> save token
    if (data.token) {
      await AsyncStorage.setItem("token", data.token);
      await AsyncStorage.setItem("user", JSON.stringify(data.user));
      return { ok: true, ...data };
    }

    return { ok: false, message: data.message || "Login failed" };
  } catch (err) {
    console.log("Login Error:", err);
    return { ok: false, message: "Network error (login)" };
  }
};

// ✅ FORGOT PASSWORD
export const forgotPassword = async ({ email }) => {
  try {
    const res = await fetch(`${API_BASE}/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    return { ok: res.ok, ...data };
  } catch (err) {
    console.log("Forgot Password Error:", err);
    return { ok: false, message: "Network error (forgot password)" };
  }
};

// ✅ LOGOUT
export const logoutUser = async () => {
  await AsyncStorage.removeItem("token");
  await AsyncStorage.removeItem("user");
};

// ✅ GET TOKEN
export const getToken = async () => {
  return AsyncStorage.getItem("token");
};
