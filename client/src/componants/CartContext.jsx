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
  const normalizeId = (val) =>
    typeof val === "object" && val !== null ? val._id || val.id : val;

  switch (action.type) {
    case "SET_ITEMS":
      return { ...state, items: action.payload };

   case "ADD_ITEM":
  const incomingId =
    typeof action.payload.productId === "object"
      ? action.payload.productId._id
      : action.payload.productId;

  const existing = state.items.find((item) => {
    const itemId =
      typeof item.productId === "object" ? item.productId._id : item.productId;
    return itemId === incomingId;
  });

  if (existing) {
    return {
      ...state,
      items: state.items.map((item) => {
        const itemId =
          typeof item.productId === "object"
            ? item.productId._id
            : item.productId;
        return itemId === incomingId
          ? { ...item, quantity: item.quantity + (action.payload.quantity || 1) }
          : item;
      }),
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
        items: state.items.filter(
          (item) => normalizeId(item.productId) !== normalizeId(action.payload)
        ),
      };

    case "UPDATE_QUANTITY":
      return {
        ...state,
        items: state.items.map((item) =>
          normalizeId(item.productId) === normalizeId(action.payload.productId)
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
        productId: item.productId || item._id || item.id || item.u_id,
        quantity: item.quantity || 1,
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
        productId: item.productId?._id || item.productId || item._id || item.id,
        quantity: item.quantity,
      }));
      setCart(itemsToAuth);

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
