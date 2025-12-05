#!/bin/bash
# Script de déploiement du frontend sur S3

echo "🔨 Building frontend..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "📦 Uploading to S3..."
aws s3 sync dist/ s3://miagerank-frontend --delete

if [ $? -ne 0 ]; then
    echo "❌ Upload failed!"
    exit 1
fi

echo "✅ Deployment successful!"

# Optionnel: Invalider le cache CloudFront
# echo "🔄 Invalidating CloudFront cache..."
# aws cloudfront create-invalidation \
#   --distribution-id YOUR_DISTRIBUTION_ID \
#   --paths "/*"

echo "🎉 Done!"

