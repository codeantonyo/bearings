import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';

// Cart is a { sku: qty } map persisted to localStorage, exactly like the
// prototype. Product details are resolved against the live catalog at render.
const CartCtx = createContext(null);
export const useCart = () => useContext(CartCtx);

const KEY = 'beco-cart';

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || '{}');
    return saved && typeof saved === 'object' ? saved : {};
  } catch { return {}; }
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(load);

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch { /* ignore */ }
  }, [cart]);

  const add = useCallback((sku, n = 1) => {
    setCart((c) => {
      const next = { ...c };
      next[sku] = (next[sku] || 0) + n;
      if (next[sku] <= 0) delete next[sku];
      return next;
    });
  }, []);

  const setQty = useCallback((sku, n) => {
    setCart((c) => {
      const next = { ...c };
      if (n <= 0) delete next[sku];
      else next[sku] = n;
      return next;
    });
  }, []);

  const remove = useCallback((sku) => setCart((c) => {
    const next = { ...c };
    delete next[sku];
    return next;
  }), []);

  const clear = useCallback(() => setCart({}), []);

  const count = useMemo(() => Object.values(cart).reduce((a, n) => a + n, 0), [cart]);

  return (
    <CartCtx.Provider value={{ cart, add, setQty, remove, clear, count }}>
      {children}
    </CartCtx.Provider>
  );
}
