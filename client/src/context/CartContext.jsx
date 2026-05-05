import { createContext, useContext, useState, useEffect } from "react";
import API from "../api/axios";

const CartContext = createContext(undefined);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("verbic_cart");
    return savedCart ? JSON.parse(savedCart) : { items: [] };
  });
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const items = cart?.items || [];
    const count = items.reduce((acc, item) => acc + (item.quantity || 0), 0);
    setCartCount(count);
    localStorage.setItem("verbic_cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = async (product) => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        // Guest cart — update locally without hitting API
        setCart(prev => {
          const items = prev?.items || [];
          const existing = items.find(i => i.productId === product._id);
          if (existing) {
            return {
              ...prev,
              items: items.map(i =>
                i.productId === product._id
                  ? { ...i, quantity: i.quantity + 1 }
                  : i
              )
            };
          }
          return {
            ...prev,
            items: [
              ...items,
              {
                productId: product._id,
                name: product.name,
                price: product.sellingPrice || product.price,
                image: product.image,
                quantity: 1
              }
            ]
          };
        });
        return;
      }

      const response = await API.post("/cart/add", {
        productId: product._id,
        name: product.name,
        price: product.sellingPrice || product.price,
        image: product.image,
        quantity: 1
      });

      setCart(response.data);
    } catch (error) {
      console.error("Failed to add to cart:", error);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        // Guest remove — update locally
        setCart(prev => ({
          ...prev,
          items: (prev?.items || []).filter(i => i.productId !== productId)
        }));
        return;
      }

      const response = await API.delete(`/cart/remove/${productId}`);
      setCart(response.data);
    } catch (error) {
      console.error("Remove failed:", error);
    }
  };

  return (
    <CartContext.Provider value={{ cart, cartCount, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};