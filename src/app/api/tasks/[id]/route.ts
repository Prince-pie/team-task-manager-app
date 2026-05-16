import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const user = await getAuthUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = params
  const body = await req.json()

  try {
    const task = await prisma.task.findUnique({
      where: { id },
      include: { project: true }
    })

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    // Check if user has permission (Owner or Member)
    const project = task.project
    if (project.ownerId !== user.id) {
      const isMember = await prisma.project.findFirst({
        where: { id: project.id, members: { some: { id: user.id } } }
      })
      if (!isMember) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: body,
      include: {
        assignee: { select: { id: true, name: true, email: true } }
      }
    })

    return NextResponse.json(updatedTask)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const user = await getAuthUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = params

  try {
    const task = await prisma.task.findUnique({
      where: { id },
      include: { project: true }
    })

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    if (task.project.ownerId !== user.id && user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await prisma.task.delete({ where: { id } })
    return NextResponse.json({ message: 'Task deleted' })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
