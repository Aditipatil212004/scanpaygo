import API_BASE from "./api";

// 🔹 SIGNUP
export const signupUser = async ({ name, email, password }) => {
  try {
    const res = await fetch(`${API_BASE}/api/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();
    return { ok: res.ok, ...data };
  } catch (err) {
    console.log("Signup Error:", err);
    return { ok: false, message: "Network error" };
  }
};

// 🔹 LOGIN (Customer + Staff)
export const loginUser = async ({ email, password, role }) => {
  try {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, role }),
    });

    const data = await res.json();
    return { ok: res.ok, ...data };
  } catch (err) {
    return { ok: false, message: "Network error" };
  }
};


