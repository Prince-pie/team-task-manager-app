export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'

export async function GET() {
    const user = await getAuthUser()
    if (!user) {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

  try {
        const projects = await prisma.project.findMany({
                where: {
                          OR: [
                            { ownerId: user.id },
                            { members: { some: { id: user.id } } }
                                    ]
                },
                include: {
                          owner: { select: { id: true, name: true, email: true } },
                          members: { select: { id: true, name: true, email: true } },
                          _count: { select: { tasks: true } }
                },
                orderBy: { createdAt: 'desc' }
        })

      return NextResponse.json(projects)
  } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
    const user = await getAuthUser()
    if (!user || user.role !== 'ADMIN') {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

  const body = await req.json()

  try {
        const project = await prisma.project.create({
                data: {
                          name: body.name,
                          description: body.description,
                          ownerId: user.id,
                          members: {
                                      connect: body.memberIds?.map((id: string) => ({ id })) || []
                          }
                }
        })
        return NextResponse.json(project)
  } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
