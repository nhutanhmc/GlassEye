#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('[Setup] Starting database setup...');

try {
  // Step 1: Generate Prisma Client
  console.log('[Setup] Generating Prisma Client...');
  execSync('npx prisma generate', { stdio: 'inherit', cwd: process.cwd() });
  console.log('[Setup] ✓ Prisma Client generated successfully');

} catch (error) {
  console.error('[Setup] Error:', error.message);
  process.exit(1);
}
