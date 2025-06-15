import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useRef,
} from "react";
import { useAuth } from "./AuthContext";

// Initial cart state
const initialState = {
  items: [],
  coupon: null,
};

// Reducer function
function cartReducer(state, action) {
  switch (action.type) {
    case "SET_ITEMS":
      return { ...state, items: action.payload };

    case "ADD_ITEM":
      const existing = state.items.find(
        (item) => item.id === action.payload.id
      );
      if (existing) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          ),
        };
      } else {
        return {
          ...state,
          items: [...state.items, action.payload],
        };
      }

    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      };

    case "UPDATE_QUANTITY":
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };

    case "APPLY_COUPON":
      return {
        ...state,
        coupon: action.payload,
      };

    case "CLEAR_CART":
      return initialState;

    default:
      return state;
  }
}

// Context creation
const CartContext = createContext();

// Provider
export function CartProvider({ children }) {
  const { cart, setCart } = useAuth();
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const isSyncingFromAuth = useRef(false);
  const isSyncingToAuth = useRef(false);

  // ✅ Sync from AuthContext.cart → CartContext.items (only once or when needed)
  useEffect(() => {
    if (!isSyncingToAuth.current && cart && Array.isArray(cart)) {
      const formatted = cart.map((item) => ({
        id: item.id || item._id,
        ...item,
      }));
      isSyncingFromAuth.current = true;
      dispatch({ type: "SET_ITEMS", payload: formatted });
    }
    isSyncingToAuth.current = false;
  }, [cart]);

  // ✅ Sync to AuthContext.cart ← CartContext.items (prevent circular update)
  useEffect(() => {
    if (
      !isSyncingFromAuth.current &&
      state.items &&
      Array.isArray(state.items)
    ) {
      const itemsToAuth = state.items.map((item) => ({
        _id: item.id || item._id,
        ...item,
      }));
      isSyncingToAuth.current = true;
      setCart(itemsToAuth);
    }
    isSyncingFromAuth.current = false;
  }, [state.items]);

  // Actions
  const addToCart = (item) => {
    dispatch({ type: "ADD_ITEM", payload: item });
  };

  const removeFromCart = (id) => {
    dispatch({ type: "REMOVE_ITEM", payload: id });
  };

  const updateQuantity = (id, quantity) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
  };

  const applyCoupon = (code) => {
    dispatch({ type: "APPLY_COUPON", payload: code });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  return (
    <CartContext.Provider
      value={{
        cartItems: state.items,
        coupon: state.coupon,
        dispatch,
        addToCart,
        removeFromCart,
        updateQuantity,
        applyCoupon,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// Custom hook
export const useCart = () => useContext(CartContext);
