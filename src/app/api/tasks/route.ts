export const dynamic = 'force-dynamic'

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
  } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
    const user = await getAuthUser()
    if (!user) {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

  const body = await req.json()

  try {
        const task = await prisma.task.create({
                data: {
                          title: body.title,
                          description: body.description,
                          status: body.status || 'TODO',
                          projectId: body.projectId,
                          assigneeId: body.assigneeId
                }
        })

      return NextResponse.json(task)
  } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
