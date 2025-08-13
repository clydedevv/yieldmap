#!/bin/bash

# YieldMap Staging Deployment Script
# Safely deploys to staging environment without affecting production

set -e

STAGING_DIR="/opt/yieldmap-staging"
REPO_URL="https://github.com/your-repo/yieldmap.git"  # Update with your actual repo
BRANCH="${1:-staging}"
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

# Check if running as the correct user
if [[ "$USER" != "$SERVICE_USER" ]]; then
    print_error "This script must be run as user: $SERVICE_USER"
    exit 1
fi

print_status "Starting staging deployment of branch: $BRANCH"

# Check if staging directory exists
if [[ ! -d "$STAGING_DIR" ]]; then
    print_error "Staging directory $STAGING_DIR doesn't exist. Run setup-staging.sh first."
    exit 1
fi

cd "$STAGING_DIR"

print_status "Backing up current staging database..."
./scripts/backup.sh || print_warning "Backup script not available, continuing..."

print_status "Stopping staging services..."
sudo systemctl stop yieldmap-staging.service yieldmap-worker-staging.service 2>/dev/null || print_warning "Services not running"

print_status "Syncing latest changes from development directory..."
# Sync changes from development directory (excluding node_modules, .next, etc.)
rsync -av --exclude 'node_modules' --exclude '.git' --exclude '.next' --exclude 'data' /home/cosmos/yieldmap/ ./

# Commit changes for tracking
git add .
git commit -m "Deploy: $(date '+%Y-%m-%d %H:%M:%S')" || print_info "No changes to commit"

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

print_status "Starting staging services..."
sudo systemctl start yieldmap-staging.service yieldmap-worker-staging.service

print_status "Waiting for services to start..."
sleep 5

# Health check
print_status "Performing health check..."
if curl -f http://localhost:3100/health >/dev/null 2>&1; then
    print_status "✅ Health check passed!"
else
    print_error "❌ Health check failed!"
    print_info "Checking service status..."
    sudo systemctl status yieldmap-staging.service --no-pager -l
    exit 1
fi

print_status "✅ Staging deployment completed successfully!"
print_info "Access staging at: https://staging.btcyield.info"
print_info "View logs: sudo journalctl -fu yieldmap-staging.service"
