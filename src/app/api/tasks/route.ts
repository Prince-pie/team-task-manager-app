import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'

export async function GET(req: Request) {
  const user = await getAuthUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const projectId = searchParams.get('projectId')

  if (!projectId) {
    return NextResponse.json({ error: 'Project ID is required' }, { status: 400 })
  }

  try {
    const tasks = await prisma.task.findMany({
      where: { projectId },
      include: {
        assignee: { select: { id: true, name: true, email: true } }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(tasks)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const user = await getAuthUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { title, description, status, priority, dueDate, projectId, assigneeId } = await req.json()

    if (!title || !projectId) {
      return NextResponse.json({ error: 'Title and Project ID are required' }, { status: 400 })
    }

    // Check if user is member of the project
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        OR: [
          { ownerId: user.id },
          { members: { some: { id: user.id } } }
        ]
      }
    })

    if (!project) {
      return NextResponse.json({ error: 'Forbidden: Access denied to project' }, { status: 403 })
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        status: status || 'TODO',
        priority: priority || 'MEDIUM',
        dueDate: dueDate ? new Date(dueDate) : null,
        projectId,
        assigneeId
      },
      include: {
        assignee: { select: { id: true, name: true, email: true } }
      }
    })

    return NextResponse.json(task)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
