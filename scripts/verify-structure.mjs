import fs from 'fs';
import path from 'path';

const srcPath = path.join(process.cwd(), 'src');
const appPath = path.join(srcPath, 'app');
const pagesPath = path.join(srcPath, 'pages');

console.log('[v0] Checking directory structure...');
console.log('[v0] src directory exists:', fs.existsSync(srcPath));
console.log('[v0] src/app directory exists:', fs.existsSync(appPath));
console.log('[v0] src/pages directory exists:', fs.existsSync(pagesPath));

if (fs.existsSync(pagesPath)) {
  console.log('[v0] Removing src/pages directory...');
  fs.rmSync(pagesPath, { recursive: true, force: true });
  console.log('[v0] src/pages removed successfully');
}

// Check root level app directory
const rootAppPath = path.join(process.cwd(), 'app');
console.log('[v0] root app directory exists:', fs.existsSync(rootAppPath));
if (fs.existsSync(rootAppPath)) {
  console.log('[v0] WARNING: Root level app directory still exists');
  console.log('[v0] Contents:', fs.readdirSync(rootAppPath));
}

// List src structure
console.log('[v0] src/ contents:', fs.readdirSync(srcPath));
console.log('[v0] src/app contents:', fs.readdirSync(appPath));
