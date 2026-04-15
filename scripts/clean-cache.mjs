import fs from 'fs';
import path from 'path';

const nextCachePath = path.join(process.cwd(), '.next');

try {
  if (fs.existsSync(nextCachePath)) {
    fs.rmSync(nextCachePath, { recursive: true, force: true });
    console.log('Successfully removed .next cache directory');
  } else {
    console.log('.next directory does not exist');
  }
} catch (error) {
  console.error('Error removing .next directory:', error);
  process.exit(1);
}
