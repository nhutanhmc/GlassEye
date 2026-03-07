import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 1. Lấy token từ Cookie
  const token = request.cookies.get('access_token')?.value;

  // 2. Kiểm tra nếu user đang vào route /admin
  if (request.nextUrl.pathname.startsWith('/admin')) {
    
    // Nếu KHÔNG CÓ token -> Đá về trang chủ (hoặc trang /login tùy bạn)
    if (!token) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    // 3. NẾU CÓ TOKEN -> Giải mã JWT để lấy role
    try {
      // JWT có cấu trúc: header.payload.signature
      // Mình lấy phần payload (phần thứ 2) để đọc thông tin
      const payloadBase64 = token.split('.')[1];
      
      // Dùng atob (chạy tốt trên Edge Runtime của Next.js) để giải mã base64
      const decodedPayload = atob(payloadBase64);
      const user = JSON.parse(decodedPayload);

      // 4. Kiểm tra Role
      if (user.role !== 'ADMIN') {
        // Nếu đã đăng nhập nhưng không phải ADMIN -> Đá về trang chủ 
        // (hoặc bạn có thể tạo một trang /403 để redirect tới)
        return NextResponse.redirect(new URL('/', request.url));
      }
    } catch (error) {
      // Nếu token bị sai định dạng hoặc lỗi khi giải mã -> Bắt đăng nhập lại
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Hợp lệ hết (Có token + Là ADMIN) -> Cho phép đi tiếp vào trang /admin
  return NextResponse.next();
}

// Cấu hình để middleware chỉ chạy khi vào /admin (giúp web chạy nhanh hơn)
export const config = {
  matcher: ['/admin/:path*'],
};