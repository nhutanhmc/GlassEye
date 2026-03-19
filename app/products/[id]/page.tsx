'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, ShoppingCart, Minus, Plus, Home } from 'lucide-react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { ContactButtons } from '@/components/contact-buttons';
import { useApp } from '@/components/providers/app-provider';

interface ProductDetail {
  id: string;
  name: string;
  description: string | null;
  price: number;
  salePrice?: number | null;
  images: string[];
  collection?: {
    id: string;
    name: string;
  };
}

const formatVND = (v: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v);

export default function ProductDetailPage() {
  // Lấy ID từ URL (ví dụ: /product/69b65... thì params.id = 69b65...)
  const params = useParams();
  const id = params.id as string;

  const { addToCart } = useApp();

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State cho ảnh đang được hiển thị to
  const [activeImage, setActiveImage] = useState<string>('/placeholder.svg');
  // State cho số lượng mua
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      setLoading(true);
      try {
        // Gọi API lấy chi tiết sản phẩm. (Lưu ý đường dẫn API của bạn có thể là /api/products/[id] hoặc /api/product/[id])
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();

        if (data.success && data.item) {
          setProduct(data.item);
          // Set ảnh mặc định là ảnh đầu tiên
          if (data.item.images && data.item.images.length > 0) {
            setActiveImage(data.item.images[0]);
          }
        } else {
          setError('Không tìm thấy sản phẩm');
        }
      } catch (err) {
        setError('Lỗi kết nối máy chủ');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    
    addToCart(
      { 
        id: product.id, 
        name: product.name, 
        price: product.price, 
        salePrice: product.salePrice ?? null, 
        imageUrl: product.images?.[0] ?? null 
      },
      quantity
    );

    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
        </div>
        <Footer />
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <h1 className="text-2xl font-bold text-foreground">Ối! {error}</h1>
          <Link href="/products" className="px-6 py-2 bg-primary text-primary-foreground rounded-lg">
            Quay lại cửa hàng
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  const finalPrice = product.salePrice ?? product.price;
  const originalPrice = product.salePrice ? product.price : undefined;

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Header />

      <div className="flex-1 max-w-7xl mx-auto px-4 py-8 md:py-12 w-full">
        {/* ========================================================
            1. BREADCRUMB NAVIGATION (HOME >>> Products >>> Tên SP)
            ======================================================== */}
        <nav className="flex items-center flex-wrap gap-2 text-sm text-muted-foreground mb-8 font-medium">
          <Link href="/" className="flex items-center hover:text-accent transition-colors">
            <Home className="w-4 h-4 mr-1" />
            HOME
          </Link>
          <ChevronRight className="w-4 h-4" />
          
          <Link href="/products" className="hover:text-accent transition-colors">
            Products
          </Link>
          <ChevronRight className="w-4 h-4" />
          
          {product.collection && (
            <>
              <Link href={`/products?collectionId=${product.collection.id}`} className="hover:text-accent transition-colors">
                {product.collection.name}
              </Link>
              <ChevronRight className="w-4 h-4" />
            </>
          )}

          <span className="text-foreground line-clamp-1">{product.name}</span>
        </nav>

        {/* ========================================================
            2. PRODUCT DETAIL LAYOUT
            ======================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
          
          {/* CỘT TRÁI: Thư viện hình ảnh */}
          <div className="flex flex-col gap-4">
            {/* Ảnh to */}
            <div className="relative aspect-square md:aspect-[4/5] overflow-hidden rounded-2xl bg-secondary border border-border">
              <Image
                src={activeImage}
                alt={product.name}
                fill
                unoptimized
                className="object-cover transition-opacity duration-500"
              />
            </div>
            
            {/* Danh sách ảnh nhỏ (Thumbnails) */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                      activeImage === img ? 'border-accent opacity-100' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <Image src={img} alt={`Thumbnail ${idx}`} fill unoptimized className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* CỘT PHẢI: Thông tin sản phẩm */}
          <div className="flex flex-col">
            {/* Tên & Giá */}
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              {product.name}
            </h1>
            
            <div className="flex items-baseline gap-4 mb-6 pb-6 border-b border-border">
              <span className="text-3xl font-black text-accent">
                {formatVND(finalPrice)}
              </span>
              {originalPrice && (
                <span className="text-lg text-muted-foreground line-through">
                  {formatVND(originalPrice)}
                </span>
              )}
            </div>

            {/* Mô tả sản phẩm */}
            <div className="mb-8 prose prose-sm sm:prose-base dark:prose-invert">
              <h3 className="font-semibold text-lg mb-2">Thông tin sản phẩm</h3>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {product.description || 'Sản phẩm này hiện chưa có mô tả chi tiết.'}
              </p>
            </div>

            {/* Chọn số lượng & Nút Mua */}
            <div className="mt-auto pt-6 border-t border-border">
              <div className="flex items-center gap-4 mb-6">
                <span className="font-semibold text-foreground">Số lượng:</span>
                <div className="flex items-center bg-secondary rounded-lg border border-border">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-black/5 rounded-l-lg transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-black/5 rounded-r-lg transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={justAdded}
                className={`w-full h-14 flex items-center justify-center gap-2 rounded-xl font-bold text-lg transition-all duration-300 ${
                  justAdded 
                    ? 'bg-green-500 text-white' 
                    : 'bg-foreground text-background hover:bg-foreground/90 active:scale-[0.98]'
                }`}
              >
                <ShoppingCart className="w-5 h-5" />
                {justAdded ? 'Đã thêm vào giỏ!' : 'Thêm vào giỏ hàng'}
              </button>
            </div>

          </div>
        </div>
      </div>

      <Footer />
      <ContactButtons />
    </main>
  );
}