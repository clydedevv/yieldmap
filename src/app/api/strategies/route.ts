import { NextRequest, NextResponse } from 'next/server';
import { getAllStrategies, createStrategy } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('active') !== 'false';
    
    const strategies = getAllStrategies(activeOnly);
    return NextResponse.json({ strategies });
  } catch (error) {
    console.error('Failed to fetch strategies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch strategies' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Generate ID if not provided
    if (!body.id) {
      body.id = `strategy_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    
    // Validate required fields
    const requiredFields = ['category', 'name', 'yield_percent', 'description', 'entry_guide', 'risk_level'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }
    
    // Ensure yield_sources is an array
    if (!body.yield_sources || !Array.isArray(body.yield_sources)) {
      body.yield_sources = [];
    }
    
    // Ensure chains is an array
    if (!body.chains || !Array.isArray(body.chains)) {
      body.chains = [];
    }
    
    const strategy = createStrategy(body);
    return NextResponse.json({ strategy }, { status: 201 });
  } catch (error) {
    console.error('Failed to create strategy:', error);
    return NextResponse.json(
      { error: 'Failed to create strategy' },
      { status: 500 }
    );
  }
} 