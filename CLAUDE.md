# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server with Turbopack (recommended)
- `npm run build` - Build production version
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Architecture Overview

This is a Next.js 15 application for exploring Bitcoin yield strategies, built with React 19, TypeScript, and SQLite.

### Core Architecture
- **Framework**: Next.js 15 with App Router and Turbopack
- **Database**: SQLite with better-sqlite3 (file-based at `data/strategies.db`)
- **UI**: React 19 with Tailwind CSS 4
- **API**: Next.js API routes with RESTful endpoints

### Key Components Structure

#### Database Layer (`src/lib/database.ts`)
- Complete CRUD operations for strategies, yield sources, and chains
- SQLite with proper indexing and foreign key constraints
- Transaction-based operations for data consistency
- Auto-initialization with schema creation

#### API Layer (`src/lib/api.ts`)
- Client-side API wrapper class `StrategyAPI`
- RESTful endpoints under `/api/strategies/`
- Handles strategy CRUD operations and visibility toggling

#### Data Models (`src/types/strategy.ts`)
Core types:
- `Strategy` - Main strategy interface with yield data, risk levels, chains
- `StrategyCategory` - 5 categories: native_btc, cex_lst, onchain_lst, babylon_core, l2_strategies
- `YieldSource` - Yield source metadata with icons
- `Chain` - Blockchain data with colors and icons

#### UI Components
- `FlowChart.tsx` - Main table-based strategy display (converted from ReactFlow)
- `TopYieldSidebar.tsx` - Top strategies sidebar
- `StrategyList.tsx` - List view component
- `ClientHomePage.tsx` - Client-side home page wrapper

#### Admin Interface (`src/app/admin/page.tsx`)
- Full strategy management interface
- Toggle strategy visibility (active/inactive)
- CRUD operations with form validation

### Database Schema
The SQLite database has three main tables:
- `strategies` - Core strategy data with categories, yields, risk levels
- `yield_sources` - Related yield sources per strategy
- `chains` - Blockchain associations per strategy

### Migration and Seeding
- `migrate-database.ts` - Database migration utilities
- `seed-database.ts` - Initial data seeding
- Database auto-initializes on first run

### API Routes Structure
- `GET /api/strategies` - List all strategies (with ?active=true/false)
- `GET /api/strategies/[id]` - Get single strategy
- `POST /api/strategies` - Create new strategy
- `PUT /api/strategies/[id]` - Update strategy
- `POST /api/strategies/[id]/toggle` - Toggle visibility

### Key Patterns
- All database operations use transactions for consistency
- Strategy visibility controlled via `is_active` boolean field
- Yield percentages support both single values and ranges (min/max)
- Risk levels: low, medium, high with corresponding colors
- Components use proper TypeScript interfaces throughout

### Development Notes
- Database file is gitignored but schema is tracked
- Uses Next.js 15 features including React 19 and Turbopack
- Admin interface requires no authentication (development setup)
- All API endpoints return JSON with proper error handling