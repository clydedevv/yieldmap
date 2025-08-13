#!/bin/bash

# YieldMap Staging Environment Setup Script
# This script sets up the staging environment without affecting production

set -e

echo "🚀 Setting up YieldMap staging environment..."

# Variables
PROD_DIR="/opt/yieldmap"
STAGING_DIR="/opt/yieldmap-staging"
CURRENT_DIR="/home/cosmos/yieldmap"
SERVICE_USER="cosmos"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
    print_error "This script should not be run as root"
    exit 1
fi

# Check if current directory is the yieldmap repo
if [[ ! -f "$CURRENT_DIR/package.json" ]]; then
    print_error "Please run this script from the yieldmap repository directory"
    exit 1
fi

print_status "Creating staging directory structure..."

# Create staging directory (as regular user, will need sudo for /opt)
sudo mkdir -p "$STAGING_DIR"
sudo mkdir -p "$STAGING_DIR/data"
sudo mkdir -p "$STAGING_DIR/logs"

# Set ownership to the service user
sudo chown -R "$SERVICE_USER:$SERVICE_USER" "$STAGING_DIR"

print_status "Copying application files to staging directory..."

# Copy the entire application to staging directory
if [[ -d "$STAGING_DIR" ]]; then
    print_warning "Staging directory exists, cleaning it..."
    sudo rm -rf "$STAGING_DIR"
fi

sudo mkdir -p "$STAGING_DIR"
sudo chown -R "$SERVICE_USER:$SERVICE_USER" "$STAGING_DIR"

# Copy all files except node_modules and .git
sudo -u "$SERVICE_USER" rsync -av --exclude 'node_modules' --exclude '.git' --exclude '.next' --exclude 'data' "$CURRENT_DIR/" "$STAGING_DIR/"

# Create necessary directories
sudo -u "$SERVICE_USER" mkdir -p "$STAGING_DIR/data"
sudo -u "$SERVICE_USER" mkdir -p "$STAGING_DIR/logs"

print_status "Initializing git repository in staging..."

# Initialize git in staging directory for future deployments
cd "$STAGING_DIR"
if [[ ! -d ".git" ]]; then
    sudo -u "$SERVICE_USER" git init
    sudo -u "$SERVICE_USER" git add .
    sudo -u "$SERVICE_USER" git commit -m "Initial staging setup"
    sudo -u "$SERVICE_USER" git branch -M main
    sudo -u "$SERVICE_USER" git checkout -b staging
fi

print_status "Creating environment files..."

# Copy environment files
sudo -u "$SERVICE_USER" cp "$CURRENT_DIR/env.production.example" "$PROD_DIR/.env.production" 2>/dev/null || {
    print_warning "Production directory doesn't exist yet, will create env file locally"
    cp "$CURRENT_DIR/env.production.example" "$CURRENT_DIR/.env.production"
}

sudo -u "$SERVICE_USER" cp "$CURRENT_DIR/env.staging.example" "$STAGING_DIR/.env.staging"

print_status "Installing dependencies for staging..."

cd "$STAGING_DIR"
sudo -u "$SERVICE_USER" npm ci

print_status "Building staging application..."

sudo -u "$SERVICE_USER" NODE_ENV=production npm run build

print_status "Creating staging database..."

# Set environment for staging and initialize database
sudo -u "$SERVICE_USER" bash -c "cd '$STAGING_DIR' && SQLITE_PATH='$STAGING_DIR/data/strategies.staging.db' npm run seed"

print_status "Staging environment setup complete!"

echo
print_status "Next steps:"
echo "1. Set up nginx configuration (see nginx-staging.conf)"
echo "2. Set up systemd services (see yieldmap-staging.service)"
echo "3. Configure DNS for staging.btcyield.info"
echo "4. Test staging environment: curl http://localhost:3100"
echo
print_warning "Remember to:"
echo "- Configure your API keys for staging (lower rate limits)"
echo "- Set POLL_CADENCE=daily in staging to avoid conflicts"
echo "- Test thoroughly before promoting to production"
