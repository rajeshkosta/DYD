#!/bin/sh

echo "Running Prisma migrations..."
npx prisma migrate deploy

echo "Running Prisma seed..."
npx prisma db seed

echo "Starting application..."
exec node dist/app.js
