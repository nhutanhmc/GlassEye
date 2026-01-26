'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { AuthUser, clearUser, loadUser, saveUser } from "@/lib/auth-store";
import { CartItem, cartCount, loadCart, saveCart } from "@/lib/cart-store";

type AppContextType = {
  user: AuthUser | null;
  setUser: (u: AuthUser | null) => void;

  cart: CartItem[];
  addToCart: (item: Omit<CartItem, "qty">, qty: number) => void;
  removeFromCart: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
  cartQty: number;
};

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<AuthUser | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);

  // hydrate from localStorage
  useEffect(() => {
    setUserState(loadUser());
    setCart(loadCart());
  }, []);

  const setUser = (u: AuthUser | null) => {
    setUserState(u);
    if (u) saveUser(u);
    else clearUser();
  };

  const persistCart = (next: CartItem[]) => {
    setCart(next);
    saveCart(next);
  };

  const addToCart = (item: Omit<CartItem, "qty">, qty: number) => {
    if (qty <= 0) return;
    const next = [...cart];
    const idx = next.findIndex((x) => x.id === item.id);
    if (idx >= 0) next[idx] = { ...next[idx], qty: next[idx].qty + qty };
    else next.push({ ...item, qty });
    persistCart(next);
  };

  const removeFromCart = (id: string) => {
    persistCart(cart.filter((x) => x.id !== id));
  };

  const updateQty = (id: string, qty: number) => {
    if (qty <= 0) return removeFromCart(id);
    persistCart(cart.map((x) => (x.id === id ? { ...x, qty } : x)));
  };

  const clearCart = () => persistCart([]);

  const cartQty = useMemo(() => cartCount(cart), [cart]);

  const value: AppContextType = {
    user,
    setUser,
    cart,
    addToCart,
    removeFromCart,
    updateQty,
    clearCart,
    cartQty,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
