#!/usr/bin/env node

/**
 * Git Cleanup Script for Next.js Migration
 * This script removes git tracking of old Vite/React Router files
 * to allow Next.js to properly detect the new app directory structure
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

try {
  console.log('🧹 Cleaning git repository for Next.js migration...\n');

  // Remove old files from git tracking (but keep them locally if they exist)
  const filesToRemove = [
    'vite.config.ts',
    'vitest.config.ts',
    'vite-env.d.ts',
    'tsconfig.app.json',
    'tsconfig.node.json',
    'src/pages',
    'src/main.tsx',
    'src/App.tsx',
    'src/index.css',
  ];

  for (const file of filesToRemove) {
    try {
      execSync(`git rm --cached "${file}" 2>/dev/null || true`, { stdio: 'pipe' });
      console.log(`✓ Removed from git: ${file}`);
    } catch (error) {
      // Silently ignore errors - files may not exist
    }
  }

  console.log('\n✅ Git cleanup complete!');
  console.log('\nNext steps:');
  console.log('1. Run: git commit -m "chore: remove old Vite configuration for Next.js migration"');
  console.log('2. Run: npm install');
  console.log('3. Run: npm run dev');
  console.log('\nThe Next.js dev server should now start without the pages/app conflict error.');

} catch (error) {
  console.error('❌ Error during git cleanup:', error.message);
  process.exit(1);
}
