#!/bin/sh
# Migration runner script for Docker container

echo "🔄 Running database migrations..."

# Wait for database to be ready
echo "⏳ Waiting for database connection..."
until nc -z -v -w30 $DB_HOST ${DB_PORT:-3306}
do
  echo "Waiting for database connection at $DB_HOST:${DB_PORT:-3306}..."
  sleep 2
done

echo "✅ Database is ready!"

# Run migrations
echo "📦 Applying migrations..."
npm run migrate:up

if [ $? -eq 0 ]; then
    echo "✅ Migrations completed successfully!"
else
    echo "❌ Migration failed!"
    exit 1
fi

echo "🚀 Starting application..."
exec "$@"
