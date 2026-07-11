import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const { phone, deviceName } = await req.json();
    if (!phone) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
    }

    let user = await prisma.user.findUnique({
      where: { phone },
      include: { sessions: true },
    });

    if (!user) {
      user = await prisma.user.create({
        data: { phone },
        include: { sessions: true },
      });
    }

    // Enforce 3-device limit
    const activeSessions = user.sessions.filter((s: any) => s.expiresAt > new Date());
    if (activeSessions.length >= 3) {
      return NextResponse.json(
        { error: 'Maximum 3 devices allowed. Please logout from another device first.' },
        { status: 403 }
      );
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    await prisma.session.create({
      data: {
        userId: user.id,
        device: deviceName || 'Unknown',
        token,
        expiresAt,
      },
    });

    return NextResponse.json({
      success: true,
      token,
      user: { id: user.id, phone: user.phone, startDate: user.startDate },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
