import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const user = await getAuthUser()
    if (!user) {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

  const { id } = await params

  try {
        const project = await prisma.project.findUnique({
                where: { id },
                include: {
                          owner: { select: { id: true, name: true, email: true } },
                          members: { select: { id: true, name: true, email: true } },
                          tasks: {
                                      include: {
                                                    assignedTo: { select: { id: true, name: true } }
                                      },
                                      orderBy: { createdAt: 'desc' }
                          }
                }
        })

      if (!project) {
              return NextResponse.json({ error: 'Project not found' }, { status: 404 })
      }

      return NextResponse.json(project)
  } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const user = await getAuthUser()
    if (!user || user.role !== 'ADMIN') {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

  const { id } = await params
    const { name, description, memberIds } = await req.json()

  try {
        const project = await prisma.project.update({
                where: { id },
                data: {
                          name,
                          description,
                          members: {
                                      set: memberIds?.map((id: string) => ({ id })) || []
                          }
                }
        })
        return NextResponse.json(project)
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
        await prisma.project.delete({ where: { id } })
        return NextResponse.json({ message: 'Project deleted' })
  } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
