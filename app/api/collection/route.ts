import { NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";
import { requireAdmin } from "@/server/middlewares/auth";
import { uploadToCloudinary } from "@/server/utils/cloudinary";

export const runtime = "nodejs";

export async function GET() {
  try {
    const collections = await prisma.collection.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, items: collections });
  } catch {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    requireAdmin(req);
    const form = await req.formData();

    const name = String(form.get("name") || "").trim();
    if (!name) return NextResponse.json({ success: false, message: "Missing name" }, { status: 400 });

    const description = (form.get("description") ? String(form.get("description")) : undefined)?.trim();

    // Xử lý field highlight (từ chuỗi sang boolean)
    const highlight = form.get("highlight") === "true";

    // Xử lý upload ảnh thumbnail
    let thumbnailUrl = null;
    const thumbnail = form.get("thumbnail");
    if (thumbnail instanceof File) {
      const uploaded = await uploadToCloudinary(thumbnail, "glassEye/collections");
      thumbnailUrl = uploaded.secure_url;
    }

    const collection = await prisma.collection.create({
      data: {
        name,
        description,
        thumbnail: thumbnailUrl,
        highlight, // Lưu vào database
      },
    });

    return NextResponse.json({ success: true, item: collection }, { status: 201 });
  } catch (err: any) {
    if (err.code === 'P2002') return NextResponse.json({ success: false, message: "Tên bộ sưu tập đã tồn tại" }, { status: 409 });
    const msg = String(err?.message || "");
    if (msg === "Unauthorized" || msg === "Forbidden") return NextResponse.json({ success: false, message: msg }, { status: 401 });
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}