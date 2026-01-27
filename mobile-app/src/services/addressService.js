import API_BASE from "./api";
import AsyncStorage from "@react-native-async-storage/async-storage";

async function authHeader() {
  const token = await AsyncStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

export const getAddresses = async () => {
  try {
    const res = await fetch(`${API_BASE}/api/address`, {
      method: "GET",
      headers: await authHeader(),
    });

    const data = await res.json();

    if (!res.ok) return { ok: false, message: data.message || "Failed" };

    return { ok: true, addresses: data.addresses };
  } catch (e) {
    return { ok: false, message: "Network error" };
  }
};

export const setDefaultAddress = async (id) => {
  try {
    const res = await fetch(`${API_BASE}/api/address/default/${id}`, {
      method: "PUT",
      headers: await authHeader(),
    });

    const data = await res.json();
    if (!res.ok) return { ok: false, message: data.message || "Failed" };

    return { ok: true };
  } catch (e) {
    return { ok: false, message: "Network error" };
  }
};

export const deleteAddress = async (id) => {
  try {
    const res = await fetch(`${API_BASE}/api/address/${id}`, {
      method: "DELETE",
      headers: await authHeader(),
    });

    const data = await res.json();
    if (!res.ok) return { ok: false, message: data.message || "Failed" };

    return { ok: true };
  } catch (e) {
    return { ok: false, message: "Network error" };
  }
};
export const saveAddress = async (payload) => {
  try {
    const res = await fetch(`${API_BASE}/api/address`, {
      method: "POST",
      headers: await authHeader(),
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) return { ok: false, message: data.message || "Failed" };
    return { ok: true, address: data.address };
  } catch (e) {
    return { ok: false, message: "Network error" };
  }
};

export const getSelectedStore = async () => {
  try {
    const res = await fetch(`${API_BASE}/api/address/selected`, {
      method: "GET",
      headers: await authHeader(),
    });

    const data = await res.json();
    if (!res.ok) return { ok: false, message: data.message || "Failed" };

    return { ok: true, selected: data.selected };
  } catch (e) {
    return { ok: false, message: "Network error" };
  }
};
