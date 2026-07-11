import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Use the initialized prisma client

async function getUser(req: NextRequest) {
  const auth = req.headers.get('Authorization');
  if (!auth?.startsWith('Bearer ')) return null;
  const session = await prisma.session.findUnique({
    where: { token: auth.substring(7) },
    include: { user: true },
  });
  if (!session || session.expiresAt < new Date()) return null;
  return session.user;
}

export async function GET(req: NextRequest) {
  try {
    const user = await getUser(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const [tasks, vacations, testResults, studySessions] = await Promise.all([
      prisma.taskProgress.findMany({ where: { userId: user.id } }),
      prisma.vacation.findMany({ where: { userId: user.id }, orderBy: { startDate: 'asc' } }),
      prisma.testResult.findMany({ where: { userId: user.id } }),
      prisma.studySession.findMany({ where: { userId: user.id } }),
    ]);

    const completedTasks: Record<string, boolean> = {};
    tasks.forEach((t) => { if (t.completed) completedTasks[t.taskId] = true; });

    return NextResponse.json({
      user: { 
        id: user.id, 
        phone: user.phone, 
        startDate: user.startDate,
        xp: user.xp,
        streak: user.streak,
        badges: JSON.parse(user.badges || '[]')
      },
      completedTasks,
      vacations: vacations.map((v) => ({
        start: v.startDate.toISOString().split('T')[0],
        end: v.endDate.toISOString().split('T')[0],
      })),
      testResults: testResults.map((tr) => ({
        monthIndex: tr.monthIndex,
        score: tr.score,
        total: tr.total,
        weakAreas: JSON.parse(tr.weakAreas || '[]'),
      })),
      studySessions: studySessions.map(s => ({
        subject: s.subject,
        durationMins: s.durationMins,
        createdAt: s.createdAt.toISOString()
      }))
    });
  } catch (error) {
    console.error('Sync GET error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getUser(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { type, payload } = await req.json();

    if (type === 'TASK_TOGGLE') {
      const { taskId, completed } = payload;
      await prisma.taskProgress.upsert({
        where: { userId_taskId: { userId: user.id, taskId } },
        update: { completed },
        create: { userId: user.id, taskId, completed },
      });
      // Award XP for completing a task
      if (completed) {
        await prisma.user.update({
          where: { id: user.id },
          data: { xp: { increment: 50 } }
        });
      }
    } else if (type === 'ADD_VACATION') {
      const { start, end } = payload;
      await prisma.vacation.create({
        data: { userId: user.id, startDate: new Date(start), endDate: new Date(end) },
      });
    } else if (type === 'REMOVE_VACATION') {
      const { id } = payload;
      await prisma.vacation.delete({ where: { id } }).catch(() => {});
    } else if (type === 'SAVE_TEST') {
      const { monthIndex, score, total, weakAreas } = payload;
      await prisma.testResult.upsert({
        where: { userId_monthIndex: { userId: user.id, monthIndex } },
        update: { score, total, weakAreas: JSON.stringify(weakAreas) },
        create: { userId: user.id, monthIndex, score, total, weakAreas: JSON.stringify(weakAreas) },
      });
      // Award XP for test completion
      await prisma.user.update({
        where: { id: user.id },
        data: { xp: { increment: score * 10 } }
      });
    } else if (type === 'LOG_STUDY') {
      const { subject, durationMins } = payload;
      
      await prisma.studySession.create({
        data: {
          userId: user.id,
          subject,
          durationMins
        }
      });

      // Update XP & Streak
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      let newStreak = user.streak;
      if (user.lastStudyDate) {
        const last = new Date(user.lastStudyDate);
        last.setHours(0, 0, 0, 0);
        const diffDays = Math.floor((today.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          newStreak += 1; // Studied yesterday, increment streak
        } else if (diffDays > 1) {
          newStreak = 1; // Missed a day, reset streak
        }
      } else {
        newStreak = 1;
      }

      await prisma.user.update({
        where: { id: user.id },
        data: {
          xp: { increment: Math.floor(durationMins * 2) }, // 2 XP per minute
          streak: newStreak,
          lastStudyDate: new Date()
        }
      });
    } else {
      return NextResponse.json({ error: 'Unknown type' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Sync POST error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
