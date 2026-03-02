#!/usr/bin/env node

const { execSync } = require('child_process');

console.log('[v0] Generating Prisma Client...');

try {
  execSync('npx prisma generate', {
    stdio: 'inherit',
    cwd: process.cwd()
  });
  console.log('[v0] ✅ Prisma Client generated successfully');
} catch (error) {
  console.error('[v0] ❌ Failed to generate Prisma Client:', error.message);
  process.exit(1);
}
