import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const topUsers = await prisma.user.findMany({
      orderBy: { xp: 'desc' },
      take: 10,
      select: {
        id: true,
        phone: true, // We will mask this in the UI
        xp: true,
        streak: true,
        badges: true
      }
    });

    // Mask phone numbers for privacy (e.g., ******1234)
    const safeUsers = topUsers.map(user => ({
      id: user.id,
      displayName: `User ${user.phone.slice(-4)}`,
      xp: user.xp,
      streak: user.streak,
      badges: JSON.parse(user.badges || '[]')
    }));

    return NextResponse.json({ leaderboard: safeUsers });
  } catch (error) {
    console.error('Leaderboard GET error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
