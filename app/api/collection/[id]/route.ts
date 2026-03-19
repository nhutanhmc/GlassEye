import { NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";
import { requireAdmin } from "@/server/middlewares/auth";

function isObjectId(id: string) {
  return /^[a-fA-F0-9]{24}$/.test(id);
}

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params;
    if (!isObjectId(id)) return NextResponse.json({ success: false, message: "Invalid id" }, { status: 400 });

    const item = await prisma.collection.findUnique({ where: { id } });
    if (!item) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });

    return NextResponse.json({ success: true, item });
  } catch {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    requireAdmin(req);
    const { id } = await ctx.params;
    if (!isObjectId(id)) return NextResponse.json({ success: false, message: "Invalid id" }, { status: 400 });

    const body = await req.json();

    const updated = await prisma.collection.update({
      where: { id },
      data: {
        name: body.name,
        description: body.description,
        thumbnail: body.thumbnail,
        // Cập nhật highlight nếu có truyền lên
        highlight: body.highlight !== undefined ? Boolean(body.highlight) : undefined,
      },
    });

    return NextResponse.json({ success: true, item: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    requireAdmin(req);
    const { id } = await ctx.params;
    if (!isObjectId(id)) return NextResponse.json({ success: false, message: "Invalid id" }, { status: 400 });

    await prisma.collection.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}