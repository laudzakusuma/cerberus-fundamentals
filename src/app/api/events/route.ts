/**
 * Events API Route
 * Handles fetching and creating events
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';

// Validation schema for creating events
const createEventSchema = z.object({
  type: z.string().min(1),
  level: z.enum(['info', 'warning', 'error', 'critical']),
  message: z.string().optional(),
  source: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

// GET /api/events - Fetch recent events
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const type = searchParams.get('type');
    const level = searchParams.get('level');
    
    const events = await prisma.event.findMany({
      where: {
        ...(type && { type }),
        ...(level && { level }),
      },
      orderBy: { createdAt: 'desc' },
      take: Math.min(limit, 100),
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
    
    return NextResponse.json({ events });
  } catch (error) {
    console.error('Failed to fetch events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

// POST /api/events - Create a new event
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const validated = createEventSchema.parse(body);
    
    const event = await prisma.event.create({
      data: {
        type: validated.type,
        level: validated.level,
        message: validated.message,
        source: validated.source,
        metadata: validated.metadata ? JSON.stringify(validated.metadata) : null,
        userId: (session.user as any).id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
    
    // TODO: Emit Socket.IO event here when websocket server is set up
    // io.emit('event:new', event);
    
    return NextResponse.json({ event }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }
    
    console.error('Failed to create event:', error);
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    );
  }
}
