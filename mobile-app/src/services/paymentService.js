import API_BASE from "./api";

export const createOrder = async (amount) => {
  const res = await fetch(`${API_BASE}/payment/create-order`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount }),
  });
  return res.json();
};

export const verifyPayment = async (data) => {
  const res = await fetch(`${API_BASE}/payment/verify-payment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};
