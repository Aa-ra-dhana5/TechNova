import axios from "axios";

const API_URL = import.meta.env.VITE_AUTH_API_URL;
axios.defaults.withCredentials = true;


// 🔐 Login using HttpOnly cookies
export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(
      `${API_URL}/auth/login`,
      { email, password },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 📝 Register (cookies not needed here)
export const registerUser = async (name, email, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/signUp`, {
      name,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 🛒 Get user cart using cookie-based auth
export const getUserCart = async () => {
  const res = await axios.get(`${API_URL}/auth/cart`, {
    withCredentials: true,
  });
  return res.data.cart;
};

// 🛒 Update cart
export const updateUserCart = async (cart) => {
  const res = await axios.post(
    `${API_URL}/auth/cart`,
    { cart },
    { withCredentials: true }
  );
  return res.data.cart;
};

// 👤 Fetch user details (if protected, include credentials)
export const fetchUserById = async (userId) => {
  try {
    const res = await axios.get(`${API_URL}/users/${userId}`, {
      withCredentials: true, // ✅ if protected
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};
