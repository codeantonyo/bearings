import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { api } from '../api.js';

const ProductsCtx = createContext(null);
export const useProducts = () => useContext(ProductsCtx);

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const d = await api.get('/products');
      setProducts(d.products);
      setError(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const bySku = useMemo(() => {
    const m = {};
    for (const p of products) m[p.sku] = p;
    return m;
  }, [products]);

  return (
    <ProductsCtx.Provider value={{ products, bySku, loading, error, refresh }}>
      {children}
    </ProductsCtx.Provider>
  );
}
