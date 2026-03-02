#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('[Setup] Starting Prisma client generation...');

try {
  // Check if we're in the right directory
  if (!fs.existsSync(path.join(__dirname, '..', 'prisma', 'schema.prisma'))) {
    console.error('[Setup] Error: prisma/schema.prisma not found');
    process.exit(1);
  }

  // Run prisma generate
  console.log('[Setup] Running: npx prisma generate');
  execSync('npx prisma generate', {
    cwd: path.join(__dirname, '..'),
    stdio: 'inherit'
  });

  console.log('[Setup] ✅ Prisma client generated successfully!');
  process.exit(0);
} catch (error) {
  console.error('[Setup] ❌ Failed to generate Prisma client:', error.message);
  process.exit(1);
}
