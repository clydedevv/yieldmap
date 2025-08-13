#!/bin/bash

# YieldMap Database Backup Script
# This script creates backups of both production and staging databases

set -e

# Variables
PROD_DB="/opt/yieldmap/data/strategies.db"
STAGING_DB="/opt/yieldmap-staging/data/strategies.staging.db"
BACKUP_DIR="/opt/yieldmap/backups"
DATE=$(date +%F)
TIMESTAMP=$(date +%F-%H%M%S)

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[BACKUP]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

print_status "Starting database backup process..."

# Function to backup a database
backup_database() {
    local source_db="$1"
    local backup_name="$2"
    
    if [[ -f "$source_db" ]]; then
        local backup_file="$BACKUP_DIR/${backup_name}.${TIMESTAMP}.bak"
        cp "$source_db" "$backup_file"
        
        # Verify backup
        if sqlite3 "$backup_file" "PRAGMA integrity_check;" | grep -q "ok"; then
            print_status "Successfully backed up $source_db to $backup_file"
            
            # Create daily backup (overwrite previous day's backup)
            local daily_backup="$BACKUP_DIR/${backup_name}.${DATE}.bak"
            cp "$backup_file" "$daily_backup"
            
            # Compress older backups (keep today's uncompressed)
            find "$BACKUP_DIR" -name "${backup_name}.*.bak" -not -name "${backup_name}.${DATE}.bak" -not -name "*${TIMESTAMP}*" -mtime +0 -exec gzip {} \;
            
            echo "$backup_file"
        else
            print_error "Backup verification failed for $source_db"
            rm -f "$backup_file"
            return 1
        fi
    else
        print_warning "Database file $source_db not found, skipping..."
        return 0
    fi
}

# Backup production database
backup_database "$PROD_DB" "strategies"

# Backup staging database
backup_database "$STAGING_DB" "strategies.staging"

print_status "Cleaning up old backups (keeping 7 daily + 4 weekly)..."

# Keep 7 daily backups
find "$BACKUP_DIR" -name "strategies.*.bak" -mtime +7 -delete 2>/dev/null || true
find "$BACKUP_DIR" -name "strategies.*.bak.gz" -mtime +7 -delete 2>/dev/null || true

# Keep 4 weekly backups (every Sunday)
find "$BACKUP_DIR" -name "strategies.staging.*.bak" -mtime +7 -delete 2>/dev/null || true
find "$BACKUP_DIR" -name "strategies.staging.*.bak.gz" -mtime +7 -delete 2>/dev/null || true

# Show backup status
print_status "Current backups:"
ls -lah "$BACKUP_DIR"/ | grep -E "\.(bak|gz)$" | tail -10

print_status "Backup process completed successfully"
