import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
      const user = await getAuthUser()
      if (!user) {
              return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }

  const { id } = await params
      const body = await req.json()

  try {
          const task = await prisma.task.findUnique({
                    where: { id },
                    include: { project: true }
          })

        if (!task) {
                  return NextResponse.json({ error: 'Task not found' }, { status: 404 })
        }

        const updatedTask = await prisma.task.update({
                  where: { id },
                  data: {
                              status: body.status,
                              title: body.title,
                              description: body.description,
                              assigneeId: body.assigneeId
                  }
        })

        return NextResponse.json(updatedTask)
  } catch (error) {
          return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
      const user = await getAuthUser()
      if (!user || user.role !== 'ADMIN') {
              return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }

  const { id } = await params

  try {
          await prisma.task.delete({ where: { id } })
          return NextResponse.json({ message: 'Task deleted' })
  } catch (error) {
          return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
