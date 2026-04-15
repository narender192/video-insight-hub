#!/bin/bash

# Remove .next cache
rm -rf .next

# Remove node_modules cache if needed
rm -rf node_modules/.vite

echo "Cache cleared. Please restart the dev server."
