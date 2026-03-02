/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
    qualities: [100, 75],
  },
  // Các cấu hình khác của bạn nếu có...
};

export default nextConfig; // Dùng export default thay cho module.exports
