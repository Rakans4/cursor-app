#!/bin/sh
set -e

# Wait for PostgreSQL to be ready
until pg_isready -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME; do
  echo "Waiting for PostgreSQL..."
  sleep 2
done
echo "PostgreSQL is ready!"

# Run database migrations and seeding
npm run db:migrate
npm run db:seed

# Start the server
echo "Starting server..."
exec node server/index.js 