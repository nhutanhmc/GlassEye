import { NextResponse } from "next/server";
import { prisma } from "../../../server/db/prisma";
import { slugify } from "../../../server/utils/slug";
import { requireAdmin } from "../../../server/middlewares/auth";
import { uploadToCloudinary } from "../../../server/utils/cloudinary";

export const runtime = "nodejs"; // quan trọng cho upload

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const page = Math.max(1, Number(url.searchParams.get("page") || "1"));
    const limit = Math.min(50, Math.max(1, Number(url.searchParams.get("limit") || "12")));
    const q = (url.searchParams.get("q") || "").trim();
    const categoryId = (url.searchParams.get("categoryId") || "").trim();

    const where: any = {};
    if (q) {
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { brand: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
        { slug: { contains: q, mode: "insensitive" } },
      ];
    }
    if (categoryId) where.categoryId = categoryId;

    const [total, items] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
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

    const brand = (form.get("brand") ? String(form.get("brand")) : undefined)?.trim();
    const description = (form.get("description") ? String(form.get("description")) : undefined)?.trim();

    const priceStr = String(form.get("price") || "").trim();
    if (!priceStr) return NextResponse.json({ success: false, message: "Missing price" }, { status: 400 });
    const price = Number(priceStr);
    if (!Number.isFinite(price) || price < 0) {
      return NextResponse.json({ success: false, message: "Invalid price" }, { status: 400 });
    }

    const salePriceStr = (form.get("salePrice") ? String(form.get("salePrice")) : "").trim();
    const salePrice = salePriceStr ? Number(salePriceStr) : undefined;
    if (salePrice !== undefined && (!Number.isFinite(salePrice) || salePrice < 0)) {
      return NextResponse.json({ success: false, message: "Invalid salePrice" }, { status: 400 });
    }

    const inStockStr = (form.get("inStock") ? String(form.get("inStock")) : "").trim();
    const inStock = inStockStr ? Number(inStockStr) : 0;
    if (!Number.isFinite(inStock) || inStock < 0) {
      return NextResponse.json({ success: false, message: "Invalid inStock" }, { status: 400 });
    }

    const isActiveStr = (form.get("isActive") ? String(form.get("isActive")) : "").trim();
    const isActive = isActiveStr ? isActiveStr === "true" || isActiveStr === "1" : true;

    const categoryId = (form.get("categoryId") ? String(form.get("categoryId")) : undefined)?.trim();

    const slugRaw = (form.get("slug") ? String(form.get("slug")) : "").trim();
    const slug = slugify(slugRaw || name);

    // file image
    const image = form.get("image");
    if (!(image instanceof File)) {
      return NextResponse.json({ success: false, message: "Missing image file (field: image)" }, { status: 400 });
    }

    // upload cloudinary
    const uploaded = await uploadToCloudinary(image, "glassEye/products");

    const created = await prisma.product.create({
      data: {
        name,
        slug,
        brand,
        description,
        price: Math.trunc(price),
        salePrice: salePrice !== undefined ? Math.trunc(salePrice) : undefined,
        inStock: Math.trunc(inStock),
        isActive,
        categoryId: categoryId || undefined,
        imageUrl: uploaded.secure_url,
        imagePublicId: uploaded.public_id,
      },
    });

    return NextResponse.json({ success: true, item: created }, { status: 201 });
  } catch (err: any) {
    const msg = String(err?.message || "");
    if (msg === "Unauthorized") return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    if (msg === "Forbidden") return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });

    return NextResponse.json({ success: false, message: "Server error", details: msg }, { status: 500 });
  }
}
