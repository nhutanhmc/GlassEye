import { NextResponse } from "next/server";
import { prisma } from "../../../../server/db/prisma";
import { UpdateProductSchema } from "../../../../server/validators/product.schema";
import { slugify } from "../../../../server/utils/slug";
import { requireAdmin } from "../../../../server/middlewares/auth";

function isObjectId(id: string) {
  return /^[a-fA-F0-9]{24}$/.test(id);
}

// Sửa kiểu dữ liệu của ctx.params thành Promise
export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    // Thêm await ở đây
    const { id } = await ctx.params; 

    if (!isObjectId(id)) {
      return NextResponse.json({ success: false, message: "Invalid id" }, { status: 400 });
    }

    const item = await prisma.product.findUnique({ where: { id } });
    if (!item) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });

    return NextResponse.json({ success: true, item });
  } catch {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    requireAdmin(req);

    // Thêm await ở đây
    const { id } = await ctx.params;

    if (!isObjectId(id)) {
      return NextResponse.json({ success: false, message: "Invalid id" }, { status: 400 });
    }

    const body = await req.json();
    const data = UpdateProductSchema.parse(body);

    const updateData: any = { ...data };
    if (typeof data.slug === "string" && data.slug.trim()) updateData.slug = slugify(data.slug);
    if (typeof data.name === "string" && (!data.slug || !data.slug.trim())) {
      updateData.slug = slugify(data.name);
    }

    const updated = await prisma.product.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, item: updated });
  } catch (err: any) {
    if (err?.name === "ZodError") {
      return NextResponse.json({ success: false, message: "Invalid data", details: err.errors }, { status: 400 });
    }
    const msg = String(err?.message || "");
    if (msg === "Unauthorized") return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    if (msg === "Forbidden") return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });

    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    requireAdmin(req);

    // Thêm await ở đây
    const { id } = await ctx.params;

    if (!isObjectId(id)) {
      return NextResponse.json({ success: false, message: "Invalid id" }, { status: 400 });
    }

    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    const msg = String(err?.message || "");
    if (msg === "Unauthorized") return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    if (msg === "Forbidden") return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });

    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}