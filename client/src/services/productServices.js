import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_PRODUCT_API_URL;

/**
 * Fetch products by category.
 */
export const fetchProductsByCategory = async (category) => {
  if (!category || typeof category !== "string") {
    console.warn(
      "fetchProductsByCategory called with invalid category:",
      category
    );
    return [];
  }

  try {
    const response = await axios.get(
      `${API_BASE_URL}/products?category=${encodeURIComponent(category)}`
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching products for category "${category}":`,
      error.message
    );
    return [];
  }
};

/**ss
 * Fetch product by ID.
 */
export const fetchProductById = async (_id) => {
  if (!_id || typeof _id !== "string") {
    console.warn("fetchProductById called with invalid ID:", _id);
    return null;
  }

  try {
    const response = await axios.get(`${API_BASE_URL}/products/${_id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product by ID "${_id}":`, error.message);
    return null;
  }
};

export const fetchProductsInBulk = async (ids) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/products/bulk, { ids }`);
    return response.data;
  } catch (error) {
    console.error("Error fetching products in bulk:", error);
    throw error;
  }
};
