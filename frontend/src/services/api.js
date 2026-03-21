import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "https://gig-kavach-7d65.vercel.app",
  withCredentials: true,
});

export const registerWorker = async (data) => {
  const res = await API.post("/worker/register", data);
  return res.data;
};

export const loginWorker = async (data) => {
  const res = await API.post("/worker/login", data);
  return res.data;
};

export const logoutWorker = async () => {
  const res = await API.post("/worker/logout");
  return res.data;
};

export const getProfile = async () => {
  const res = await API.get("/worker/profile");
  return res.data;
};

export const createPaymentOrder = async (data) => {
  const res = await API.post("/worker/payment/create-order", data);
  return res.data;
};

export const verifyPayment = async (data) => {
  const res = await API.post("/worker/payment/verify", data);
  return res.data;
};

export default API;
