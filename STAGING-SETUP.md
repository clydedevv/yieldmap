# YieldMap Staging Environment Setup

This guide sets up a proper staging environment for YieldMap without disrupting the production instance.

## Overview

**Layout**: Same Hetzner box, two working copies with different environments, ports, and databases.

```
/opt/yieldmap           # Production (port 3001, main branch)
├── .env.production
└── data/strategies.db

/opt/yieldmap-staging   # Staging (port 3100, staging branch)
├── .env.staging
└── data/strategies.staging.db
```

## Quick Setup

### 1. Run the Setup Script

```bash
# From your development directory
cd /home/cosmos/yieldmap
chmod +x scripts/setup-staging.sh
./scripts/setup-staging.sh
```

This will:
- Create `/opt/yieldmap-staging` directory
- Clone your repo to staging location
- Set up staging branch
- Install dependencies and build
- Create staging database

### 2. Set Up Environment Files

```bash
# Copy environment templates to their final locations
sudo cp env.production.example /opt/yieldmap/.env.production
sudo cp env.staging.example /opt/yieldmap-staging/.env.staging

# Set proper ownership
sudo chown cosmos:cosmos /opt/yieldmap/.env.production
sudo chown cosmos:cosmos /opt/yieldmap-staging/.env.staging
```

### 3. Install System Services

```bash
# Copy service files
sudo cp scripts/yieldmap-prod.service /etc/systemd/system/
sudo cp scripts/yieldmap-worker-prod.service /etc/systemd/system/
sudo cp scripts/yieldmap-staging.service /etc/systemd/system/
sudo cp scripts/yieldmap-worker-staging.service /etc/systemd/system/

# Reload systemd and enable services
sudo systemctl daemon-reload
sudo systemctl enable yieldmap-staging.service yieldmap-worker-staging.service
```

### 4. Set Up Nginx for Staging

```bash
# Install staging nginx config
sudo cp scripts/nginx-staging.conf /etc/nginx/sites-available/staging.btcyield.info
sudo ln -s /etc/nginx/sites-available/staging.btcyield.info /etc/nginx/sites-enabled/

# Test and reload nginx
sudo nginx -t
sudo systemctl reload nginx
```

### 5. Configure DNS

Add an A record in your DNS provider (GoDaddy):
- **Host**: `staging`
- **Points to**: Your server IP (same as production)
- **TTL**: 300 seconds

### 6. Set Up SSL

```bash
# Get SSL certificate for staging subdomain
sudo certbot --nginx -d staging.btcyield.info
```

## Environment Configuration

### Production (.env.production)
```ini
NODE_ENV=production
APP_ENV=prod
PORT=3001
SQLITE_PATH=/opt/yieldmap/data/strategies.db
ENABLE_LIVE=true
POLL_CADENCE=hourly
```

### Staging (.env.staging)
```ini
NODE_ENV=production
APP_ENV=staging
PORT=3100
SQLITE_PATH=/opt/yieldmap-staging/data/strategies.staging.db
ENABLE_LIVE=true
POLL_CADENCE=daily  # Lower cadence to avoid API conflicts
```

## Daily Workflow

### Deploy to Staging
```bash
cd /opt/yieldmap-staging
sudo -u cosmos ./scripts/deploy-staging.sh
```

### Test Staging
```bash
# Health check
curl https://staging.btcyield.info/health

# Check staging-specific endpoint
curl https://staging.btcyield.info/staging-info
```

### Deploy to Production (when ready)
```bash
cd /opt/yieldmap
sudo -u cosmos ./scripts/deploy-production.sh
```

## Service Management

### Start/Stop Services
```bash
# Staging
sudo systemctl start yieldmap-staging.service yieldmap-worker-staging.service
sudo systemctl stop yieldmap-staging.service yieldmap-worker-staging.service

# Production
sudo systemctl start yieldmap-prod.service yieldmap-worker-prod.service
sudo systemctl stop yieldmap-prod.service yieldmap-worker-prod.service
```

### View Logs
```bash
# Staging logs
sudo journalctl -fu yieldmap-staging.service
sudo journalctl -fu yieldmap-worker-staging.service

# Production logs
sudo journalctl -fu yieldmap-prod.service
sudo journalctl -fu yieldmap-worker-prod.service
```

## Branch Strategy

- **main** → Production deployment
- **staging** → Staging deployment

### Typical Workflow
1. Develop features on feature branches
2. Merge to `staging` branch
3. Deploy to staging: `./scripts/deploy-staging.sh`
4. Test thoroughly on staging
5. Merge staging to `main`
6. Deploy to production: `./scripts/deploy-production.sh`

## Backup & Safety

### Automatic Backups
```bash
# Add to crontab for daily backups
sudo crontab -e

# Add this line for 2 AM daily backups
0 2 * * * /opt/yieldmap/scripts/backup.sh
```

### Manual Backup
```bash
cd /opt/yieldmap
./scripts/backup.sh
```

### Emergency Rollback
If production deployment fails, the deploy script automatically rolls back using the pre-deployment backup.

## Staging Hygiene

### API Rate Limits
- Staging uses `POLL_CADENCE=daily` to avoid hitting API limits
- Consider using separate API keys for staging where possible

### Database Separation
- Production: `/opt/yieldmap/data/strategies.db`
- Staging: `/opt/yieldmap-staging/data/strategies.staging.db`
- Completely isolated - staging cannot affect production data

### Search Engine Protection
- Staging has `X-Robots-Tag: noindex, nofollow` header
- Optional HTTP basic auth available (uncomment in nginx config)

## URLs

- **Production**: https://btcyield.info
- **Staging**: https://staging.btcyield.info
- **Staging Info**: https://staging.btcyield.info/staging-info

## Troubleshooting

### Port Conflicts
If you see port conflicts, check what's running:
```bash
sudo netstat -tlnp | grep :3001  # Production
sudo netstat -tlnp | grep :3100  # Staging
```

### Database Issues
Check database permissions and paths:
```bash
ls -la /opt/yieldmap/data/
ls -la /opt/yieldmap-staging/data/
```

### Service Issues
Check service status:
```bash
sudo systemctl status yieldmap-staging.service
sudo systemctl status yieldmap-worker-staging.service
```

## Security Notes

- Staging and production are completely isolated
- Different databases, ports, and process spaces
- Staging workers run with lower cadence to avoid API conflicts
- All scripts include safety checks to prevent production disruption

This setup gives you a real staging environment without operational theater - same box, full isolation, proper testing capability.
