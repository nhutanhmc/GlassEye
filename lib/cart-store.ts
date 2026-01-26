import { safeJsonParse } from "./storage";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  salePrice?: number | null;
  imageUrl?: string | null;
  qty: number;
};

const KEY = "glassEye_cart";

export function loadCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  return safeJsonParse<CartItem[]>(localStorage.getItem(KEY), []);
}

export function saveCart(items: CartItem[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
}

export function cartCount(items: CartItem[]) {
  return items.reduce((sum, it) => sum + (it.qty || 0), 0);
}
