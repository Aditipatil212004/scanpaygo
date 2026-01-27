import api from "./api";

export const createOrder = async (amount) => {
  const res = await api.post("/payment/create-order", { amount });
  return res.data;
};

export const verifyPayment = async (data) => {
  const res = await api.post("/payment/verify", data);
  return res.data;
};
