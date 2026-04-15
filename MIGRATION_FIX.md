# Next.js Migration Fix - Pages/App Conflict Resolution

## Problem
Next.js detected both `pages` and `app` directories in different locations, which causes a conflict. This happens when git still tracks old Vite/React Router files from the original project.

## Solution
The git repository needs to stop tracking the old files. Follow these steps:

### Option 1: Use the Cleanup Script (Recommended)
Run the provided cleanup script to automatically remove old files from git tracking:

```bash
node scripts/cleanup-git.mjs
```

Then commit the changes:
```bash
git commit -m "chore: remove old Vite configuration for Next.js migration"
```

### Option 2: Manual Git Cleanup
Run these commands one by one:

```bash
# Remove old Vite config files from git tracking
git rm --cached vite.config.ts vitest.config.ts vite-env.d.ts tsconfig.app.json tsconfig.node.json 2>/dev/null || true

# Remove old source files from git tracking
git rm --cached src/pages -r 2>/dev/null || true
git rm --cached src/main.tsx src/App.tsx src/index.css 2>/dev/null || true

# Commit the changes
git commit -m "chore: remove old Vite configuration for Next.js migration"
```

## After Cleanup

Once the git cleanup is complete:

1. Run `npm install` to reinstall dependencies
2. Run `npm run dev` to start the Next.js development server
3. The app should now load without the pages/app conflict error

## Project Structure

After migration, your project structure is now:

```
project/
├── src/
│   ├── app/
│   │   ├── layout.tsx (root layout with providers)
│   │   ├── page.tsx (analyze page)
│   │   ├── extract/page.tsx
│   │   ├── transcribe/page.tsx
│   │   ├── summarize/page.tsx
│   │   ├── search/page.tsx
│   │   ├── not-found.tsx
│   │   ├── providers.tsx (client providers)
│   │   └── globals.css (global styles)
│   ├── components/
│   ├── contexts/
│   ├── hooks/
│   └── lib/
├── next.config.ts
├── tailwind.config.ts
├── postcss.config.js
├── tsconfig.json
└── package.json
```

## Troubleshooting

If you still see the error after cleanup:
1. Clear the `.next` cache: `rm -rf .next`
2. Clear node_modules: `rm -rf node_modules`
3. Reinstall: `npm install`
4. Try again: `npm run dev`
