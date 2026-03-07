import { NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";
import { requireAdmin } from "@/server/middlewares/auth";

export async function GET(req: Request) {
  try {
    // Chỉ Admin mới được quyền xem danh sách User
    requireAdmin(req);

    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      // Bảo mật: Chỉ lấy những trường cần thiết, KHÔNG lấy passwordHash
      select: {
        id: true,
        email: true,
        role: true,
        name: true,
        phone: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ success: true, items: users });
  } catch (err: any) {
    const msg = String(err?.message || "");
    if (msg === "Unauthorized" || msg === "Forbidden") {
      return NextResponse.json({ success: false, message: msg }, { status: 401 });
    }
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}