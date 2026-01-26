import { safeJsonParse } from "./storage";

export type AuthUser = {
  id: string;
  name?: string | null;
  email: string;
  role: "GUEST" | "USER" | "ADMIN";
};

const KEY = "glassEye_user";

export function loadUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  return safeJsonParse<AuthUser | null>(localStorage.getItem(KEY), null);
}

export function saveUser(user: AuthUser) {
  localStorage.setItem(KEY, JSON.stringify(user));
}

export function clearUser() {
  localStorage.removeItem(KEY);
}
