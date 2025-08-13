#!/bin/bash

# YieldMap Production Deployment Script
# SAFELY deploys to production with rollback capability

set -e

PROD_DIR="/opt/yieldmap"
BRANCH="${1:-main}"
SERVICE_USER="cosmos"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[DEPLOY]${NC} $1"
}

print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Safety checks
if [[ "$USER" != "$SERVICE_USER" ]]; then
    print_error "This script must be run as user: $SERVICE_USER"
    exit 1
fi

if [[ "$BRANCH" != "main" ]]; then
    print_warning "Deploying branch '$BRANCH' to production. Are you sure? (y/N)"
    read -r confirm
    if [[ "$confirm" != "y" && "$confirm" != "Y" ]]; then
        print_info "Deployment cancelled"
        exit 0
    fi
fi

print_status "🚀 Starting PRODUCTION deployment of branch: $BRANCH"
print_warning "This will update the live production site!"

# Final confirmation
print_warning "Last chance to abort. Continue with production deployment? (y/N)"
read -r final_confirm
if [[ "$final_confirm" != "y" && "$final_confirm" != "Y" ]]; then
    print_info "Deployment cancelled"
    exit 0
fi

cd "$PROD_DIR"

print_status "Creating pre-deployment backup..."
BACKUP_FILE="$PROD_DIR/data/strategies.predeploy.$(date +%F-%H%M%S).bak"
cp "$PROD_DIR/data/strategies.db" "$BACKUP_FILE"
print_info "Backup created: $BACKUP_FILE"

print_status "Stopping production worker (keeping app running)..."
sudo systemctl stop yieldmap-worker-prod.service

print_status "Fetching latest changes from $BRANCH branch..."
git fetch origin
git checkout "$BRANCH"
git reset --hard "origin/$BRANCH"

print_status "Installing dependencies..."
npm ci

print_status "Running database migrations..."
if [[ -f "./scripts/migrate.js" ]]; then
    node ./scripts/migrate.js
else
    print_info "No migration script found, skipping..."
fi

print_status "Building application..."
NODE_ENV=production npm run build

print_status "Restarting production services..."
sudo systemctl restart yieldmap-prod.service yieldmap-worker-prod.service

print_status "Waiting for services to start..."
sleep 10

# Health check
print_status "Performing health check..."
if curl -f http://localhost:3000/health >/dev/null 2>&1; then
    print_status "✅ Health check passed!"
    print_status "✅ PRODUCTION deployment completed successfully!"
    print_info "Site is live at: https://btcyield.info"
    print_info "Backup location: $BACKUP_FILE"
else
    print_error "❌ Health check failed! Rolling back..."
    
    # Rollback process
    print_status "Stopping services for rollback..."
    sudo systemctl stop yieldmap-worker-prod.service
    
    print_status "Restoring database backup..."
    cp "$BACKUP_FILE" "$PROD_DIR/data/strategies.db"
    
    print_status "Restarting services..."
    sudo systemctl restart yieldmap-prod.service yieldmap-worker-prod.service
    
    print_error "❌ Deployment failed and has been rolled back"
    print_info "Check logs: sudo journalctl -fu yieldmap-prod.service"
    exit 1
fi
