import { NextRequest, NextResponse } from 'next/server';
import { toggleStrategyVisibility } from '@/lib/database';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const strategy = toggleStrategyVisibility(id);
    
    if (!strategy) {
      return NextResponse.json(
        { error: 'Strategy not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ strategy });
  } catch (error) {
    console.error('Failed to toggle strategy visibility:', error);
    return NextResponse.json(
      { error: 'Failed to toggle strategy visibility' },
      { status: 500 }
    );
  }
} 