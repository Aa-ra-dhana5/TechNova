import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_PRODUCT_API_URL;

/**
 * Fetch products by category.
 */
export const fetchProductsByCategory = async (
  category,
  page,
  limit,
  brand,
  sortOption
) => {
  if (!category || typeof category !== "string") {
    console.warn(
      "fetchProductsByCategory called with invalid category:",
      category
    );
    return { data: [] };
  }

  const queryParams = new URLSearchParams();
  queryParams.append("category", category);
  if (page) queryParams.append("page", page);
  if (limit) queryParams.append("limit", limit);
  if (brand) queryParams.append("brand", brand);
  if (sortOption) queryParams.append("sort", sortOption);

  try {
    const res = await fetch(
      `${
        import.meta.env.VITE_PRODUCT_API_URL
      }/products?${queryParams.toString()}`
    );
    const result = await res.json();

    // Handle if the backend returns { success, data: [...] }
    return { data: result.data || [] };
  } catch (error) {
    console.error("Error fetching products:", error.message);
    return { data: [] };
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
