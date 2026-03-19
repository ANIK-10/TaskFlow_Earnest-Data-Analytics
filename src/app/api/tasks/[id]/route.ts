
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAccessToken } from '@/lib/auth-utils';

async function getAuthPayload(req: Request) {
  const authHeader = req.headers.get('Authorization');
  const token = authHeader?.split(' ')[1];
  if (!token) return null;
  return await verifyAccessToken(token);
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = await params;
    const payload = await getAuthPayload(req);
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const task = await prisma.task.findUnique({ where: { id } });
    if (!task) return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    if (task.userId !== payload.userId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    return NextResponse.json(task);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = await params;
    const payload = await getAuthPayload(req);
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { title, description, completed, priority, category } = await req.json();

    const existingTask = await prisma.task.findUnique({ where: { id } });
    if (!existingTask) return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    if (existingTask.userId !== payload.userId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const task = await prisma.task.update({
      where: { id },
      data: { 
        title, 
        description, 
        completed,
        priority,
        category
      },
    });

    return NextResponse.json(task);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = await params;
    const payload = await getAuthPayload(req);
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const existingTask = await prisma.task.findUnique({ where: { id } });
    if (!existingTask) return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    if (existingTask.userId !== payload.userId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    await prisma.task.delete({ where: { id } });

    return NextResponse.json({ message: 'Task deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
