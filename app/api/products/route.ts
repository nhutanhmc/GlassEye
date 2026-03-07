import { NextResponse } from "next/server";
import { prisma } from "../../../server/db/prisma";
import { requireAdmin } from "../../../server/middlewares/auth";
import { uploadToCloudinary } from "../../../server/utils/cloudinary";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const page = Math.max(1, Number(url.searchParams.get("page") || "1"));
    const limit = Math.min(50, Math.max(1, Number(url.searchParams.get("limit") || "12")));
    const q = (url.searchParams.get("q") || "").trim();
    
    // Hỗ trợ cả query param cũ (categoryId) và mới (collectionId)
    const collectionId = (url.searchParams.get("collectionId") || url.searchParams.get("categoryId") || "").trim();

    const where: any = {};
    if (q) {
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
      ];
    }
    if (collectionId) where.collectionId = collectionId;

    // Chú ý: Gọi vào bảng glass
    const [total, items] = await Promise.all([
      prisma.glass.count({ where }),
      prisma.glass.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    return NextResponse.json({
      success: true,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      items,
    });
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

    const priceStr = String(form.get("price") || "").trim();
    const price = parseFloat(priceStr);
    if (isNaN(price) || price < 0) return NextResponse.json({ success: false, message: "Invalid price" }, { status: 400 });

    // Lấy collectionId (hỗ trợ cả field cũ là categoryId)
    const collectionId = String(form.get("collectionId") || form.get("categoryId") || "").trim();
    if (!collectionId) return NextResponse.json({ success: false, message: "Missing collectionId" }, { status: 400 });

    const attributesRaw = form.get("attributes");
    const attributes = attributesRaw ? JSON.parse(String(attributesRaw)) : null;

    // ----------------------------------------------------------------------
    // PHẦN ĐÃ SỬA: Xử lý file ảnh an toàn hơn, tránh lỗi crash do push mảng
    // ----------------------------------------------------------------------
    const imageFiles = form.getAll("images"); 
    const oldSingleImage = form.get("image"); 
    
    // Tạo mảng mới chỉ chứa các file hợp lệ
    const validFiles: File[] = [];
    
    // Kiểm tra tất cả file trong field 'images'
    for (const file of imageFiles) {
      if (file instanceof File) validFiles.push(file);
    }
    
    // Fallback nếu không có 'images' nhưng có 'image' (từ form cũ)
    if (validFiles.length === 0 && oldSingleImage instanceof File) {
      validFiles.push(oldSingleImage);
    }

    // Upload tất cả ảnh hợp lệ lên Cloudinary
    const imageUrls: string[] = [];
    for (const file of validFiles) {
      const uploaded = await uploadToCloudinary(file, "glassEye/products");
      imageUrls.push(uploaded.secure_url);
    }
    // ----------------------------------------------------------------------

    const created = await prisma.glass.create({
      data: {
        name,
        description,
        price,
        attributes,
        images: imageUrls,
        collectionId,
      },
    });

    return NextResponse.json({ success: true, item: created }, { status: 201 });
  } catch (err: any) {
    const msg = String(err?.message || "");
    if (msg === "Unauthorized" || msg === "Forbidden") return NextResponse.json({ success: false, message: msg }, { status: 401 });
    return NextResponse.json({ success: false, message: "Server error", details: msg }, { status: 500 });
  }
}