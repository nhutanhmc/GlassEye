import jwt from "jsonwebtoken";

type JwtPayload = {
  sub: string;
  email: string;
  role?: "GUEST" | "USER" | "ADMIN";
};

export function getTokenFromRequest(req: Request): string | null {
  const auth = req.headers.get("authorization");
  if (auth?.startsWith("Bearer ")) return auth.slice("Bearer ".length).trim();

  const cookie = req.headers.get("cookie") || "";
  const match = cookie.match(/(?:^|;\s*)access_token=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export function requireAdmin(req: Request): JwtPayload {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("Missing JWT_SECRET");

  const token = getTokenFromRequest(req);
  if (!token) throw new Error("Unauthorized");

  const decoded = jwt.verify(token, secret) as JwtPayload;

  if (decoded.role !== "ADMIN") throw new Error("Forbidden");
  return decoded;
}
