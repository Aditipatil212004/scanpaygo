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

  // ✅ Add item to cart (if exists -> qty+1)
  const addToCart = (product) => {
    if (!product?.id) return;

    setItems((prev) => {
      const existing = prev.find((p) => p.id === product.id);

      if (existing) {
        return prev.map((p) =>
          p.id === product.id ? { ...p, qty: (p.qty || 1) + 1 } : p
        );
      }

      return [...prev, { ...product, qty: 1 }];
    });
  };

  // ✅ Increase qty
  const increaseQty = (id) => {
    setItems((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, qty: (p.qty || 1) + 1 } : p
      )
    );
  };

  // ✅ Decrease qty (if becomes 0 -> remove)
  const decreaseQty = (id) => {
    setItems((prev) =>
      prev
        .map((p) =>
          p.id === id ? { ...p, qty: Math.max((p.qty || 1) - 1, 0) } : p
        )
        .filter((p) => p.qty > 0)
    );
  };

  // ✅ Remove item completely
  const removeFromCart = (id) => {
    setItems((prev) => prev.filter((p) => p.id !== id));
  };

  // ✅ Clear cart
  const clearCart = () => setItems([]);

  // ✅ Totals (auto calculation)
  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
    const tax = Math.round(subtotal * 0.05); // 5% tax
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

  // ✅ best debugging message
  if (ctx === undefined) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return ctx;
};
