import React, { createContext, useContext, useMemo, useState } from "react";

/**
 * items format:
 * {
 *   id: string,
 *   name: string,
 *   price: number,
 *   qty: number,
 *   image: any (require() OR { uri })
 * }
 */

const CartContext = createContext(undefined);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);

  // ✅ FIXED Add to cart
const addToCart = (product) => {
  setItems((prev) => {
    const existing = prev.find((p) => p.id === product.id);

    if (existing) {
      return prev.map((p) =>
        p.id === product.id ? { ...p, qty: p.qty + 1 } : p
      );
    }

    return [...prev, { ...product, qty: 1 }];
  });
};




  // ✅ Increase qty
  const increaseQty = (id) => {
    setItems((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, qty: p.qty + 1 } : p
      )
    );
  };

  // ✅ Decrease qty
  const decreaseQty = (id) => {
    setItems((prev) =>
      prev
        .map((p) =>
          p.id === id ? { ...p, qty: p.qty - 1 } : p
        )
        .filter((p) => p.qty > 0)
    );
  };

  // ✅ Remove item
  const removeFromCart = (id) => {
    setItems((prev) => prev.filter((p) => p.id !== id));
  };

  // ✅ Clear cart
  const clearCart = () => setItems([]);

  // ✅ Totals
  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
    const tax = Math.round(subtotal * 0.05);
    const total = subtotal + tax;
    const count = items.reduce((sum, i) => sum + i.qty, 0);

    return { subtotal, tax, total, count };
  }, [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        totals,
        addToCart,
        increaseQty,
        decreaseQty,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
};
