import axios from "axios";

const API_URL = import.meta.env.VITE_AUTH_API_URL;

export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

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

export const getUserCart = async (userId, token) => {
  const res = await axios.get(`http://localhost:5000/api/auth/cart/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data.cart;
};

export const updateUserCart = async (userId, cart, token) => {
  const res = await axios.post(
    `http://localhost:5000/api/auth/cart/${userId}`,
    { cart },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data.cart;
};

export const fetchUserById = async (userId) => {
  try {
    const res = await axios.get(`http://localhost:5000/api/users/${userId}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};
