#!/usr/bin/env node

/**
 * YieldMap Worker Process
 * Handles background tasks like yield data fetching and database updates
 */

import { initDatabase } from '../lib/database.js';

interface WorkerConfig {
  pollCadence: 'hourly' | 'daily';
  enableLive: boolean;
  environment: 'prod' | 'staging';
}

class YieldMapWorker {
  private config: WorkerConfig;
  private isRunning: boolean = false;
  private intervalId: NodeJS.Timeout | null = null;

  constructor() {
    this.config = {
      pollCadence: (process.env.POLL_CADENCE as 'hourly' | 'daily') || 'daily',
      enableLive: process.env.ENABLE_LIVE === 'true',
      environment: (process.env.APP_ENV as 'prod' | 'staging') || 'staging'
    };

    console.log('YieldMap Worker Configuration:', this.config);
  }

  private getIntervalMs(): number {
    return this.config.pollCadence === 'hourly' ? 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
  }

  private async updateYieldData(): Promise<void> {
    try {
      console.log(`[${new Date().toISOString()}] Starting yield data update...`);
      
      if (!this.config.enableLive) {
        console.log('Live data updates disabled, skipping...');
        return;
      }

      // TODO: Implement actual yield data fetching
      // This is where you'll add your adapter logic from the PRD
      
      console.log('Yield data update completed');
    } catch (error) {
      console.error('Error updating yield data:', error);
    }
  }

  private async updateRegimeData(): Promise<void> {
    try {
      console.log('Updating regime data (BTC vol, OI, funding rates)...');
      
      // TODO: Implement regime board data collection
      // - BTC 30d volatility
      // - Perpetual open interest
      // - Funding rates across venues
      // - DEX depth metrics
      
      console.log('Regime data update completed');
    } catch (error) {
      console.error('Error updating regime data:', error);
    }
  }

  private async performMaintenance(): Promise<void> {
    try {
      console.log('Performing database maintenance...');
      
      // TODO: Add database cleanup, archival, etc.
      
      console.log('Maintenance completed');
    } catch (error) {
      console.error('Error during maintenance:', error);
    }
  }

  private async runWorkerCycle(): Promise<void> {
    console.log(`[${new Date().toISOString()}] Worker cycle starting (${this.config.environment} environment)`);
    
    await this.updateYieldData();
    await this.updateRegimeData();
    
    // Run maintenance less frequently
    const hour = new Date().getHours();
    if (hour === 2) { // 2 AM
      await this.performMaintenance();
    }
    
    console.log(`[${new Date().toISOString()}] Worker cycle completed`);
  }

  public start(): void {
    if (this.isRunning) {
      console.log('Worker is already running');
      return;
    }

    console.log('Starting YieldMap Worker...');
    console.log(`Poll cadence: ${this.config.pollCadence}`);
    console.log(`Environment: ${this.config.environment}`);
    
    // Initialize database
    initDatabase();
    
    // Run immediately on start
    this.runWorkerCycle().catch(console.error);
    
    // Set up recurring execution
    this.intervalId = setInterval(() => {
      this.runWorkerCycle().catch(console.error);
    }, this.getIntervalMs());
    
    this.isRunning = true;
    console.log('Worker started successfully');
  }

  public stop(): void {
    if (!this.isRunning) {
      console.log('Worker is not running');
      return;
    }

    console.log('Stopping YieldMap Worker...');
    
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    
    this.isRunning = false;
    console.log('Worker stopped');
  }
}

// Handle graceful shutdown
const worker = new YieldMapWorker();

process.on('SIGINT', () => {
  console.log('Received SIGINT, shutting down gracefully...');
  worker.stop();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Received SIGTERM, shutting down gracefully...');
  worker.stop();
  process.exit(0);
});

// Start the worker
worker.start();
