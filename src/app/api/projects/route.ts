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
        owner: { select: { name: true, email: true } },
        members: { select: { id: true, name: true, email: true } },
        _count: { select: { tasks: true } }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(projects)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const user = await getAuthUser()
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden: Admins only' }, { status: 403 })
  }

  try {
    const { name, description, memberEmails } = await req.json()

    if (!name) {
      return NextResponse.json({ error: 'Project name is required' }, { status: 400 })
    }

    const members = await prisma.user.findMany({
      where: { email: { in: memberEmails || [] } }
    })

    const project = await prisma.project.create({
      data: {
        name,
        description,
        ownerId: user.id,
        members: {
          connect: members.map(m => ({ id: m.id }))
        }
      },
      include: {
        members: true
      }
    })

    return NextResponse.json(project)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
