import { NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";
import { requireAdmin } from "@/server/middlewares/auth";

function isObjectId(id: string) {
  return /^[a-fA-F0-9]{24}$/.test(id);
}

// Lấy thông tin chi tiết 1 user
export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params;
    if (!isObjectId(id)) return NextResponse.json({ success: false, message: "Invalid id" }, { status: 400 });

    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, role: true, name: true, phone: true, createdAt: true },
    });

    if (!user) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });

    return NextResponse.json({ success: true, item: user });
  } catch {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

// Cập nhật User (Thường Admin chỉ dùng để đổi Role hoặc sửa sđt/tên)
export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    requireAdmin(req);
    const { id } = await ctx.params;
    if (!isObjectId(id)) return NextResponse.json({ success: false, message: "Invalid id" }, { status: 400 });

    const body = await req.json();
    const updateData: any = {};

    // Chỉ cho phép update những trường an toàn
    if (body.role && ["ADMIN", "USER", "GUEST"].includes(body.role)) {
      updateData.role = body.role;
    }
    if (body.name !== undefined) updateData.name = body.name;
    if (body.phone !== undefined) updateData.phone = body.phone;

    const updated = await prisma.user.update({
      where: { id },
      data: updateData,
      select: { id: true, email: true, role: true, name: true, phone: true },
    });

    return NextResponse.json({ success: true, item: updated });
  } catch (err: any) {
    const msg = String(err?.message || "");
    if (msg === "Unauthorized" || msg === "Forbidden") return NextResponse.json({ success: false, message: msg }, { status: 401 });
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

// Xóa User
export async function DELETE(req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    requireAdmin(req);
    const { id } = await ctx.params;
    if (!isObjectId(id)) return NextResponse.json({ success: false, message: "Invalid id" }, { status: 400 });

    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    const msg = String(err?.message || "");
    if (msg === "Unauthorized" || msg === "Forbidden") return NextResponse.json({ success: false, message: msg }, { status: 401 });
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}