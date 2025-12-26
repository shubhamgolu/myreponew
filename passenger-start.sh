#!/bin/bash

echo "=== Passenger start script running ==="

# Go to app directory
cd /home/stagingprowebven/deepsiteapp || exit 1

# Use correct node & npm (important for cPanel)
export PATH=/opt/cpanel/ea-nodejs22/bin/:$PATH
export NODE_ENV=production

# Install dependencies (safe even if already installed)
npm install --production

# Build Next.js app (only first time / on update)
npm run build

# Start Next.js SSR server
exec npm start
