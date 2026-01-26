# ---- deps ----
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
# Nếu bạn có file prisma/schema.prisma, hãy copy nó vào đây 
# để prisma generate có thể chạy ngay sau khi cài deps
COPY prisma ./prisma/ 
RUN npm ci
# Khởi tạo Prisma Client ngay tại bước deps để tận dụng cache
RUN npx prisma generate

# ---- build ----
FROM node:20-alpine AS builder
WORKDIR /app
# Copy node_modules đã có cả thư viện và Prisma Client từ stage deps
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
# Chạy build (lúc này Prisma đã sẵn sàng nên sẽ không lỗi)
RUN npm run build

# ---- runner ----
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
# Nếu bạn cần file schema ở runtime (tùy cấu hình) thì copy thêm:
# COPY --from=builder /app/prisma ./prisma 

EXPOSE 3000
CMD ["npm","run","start"]