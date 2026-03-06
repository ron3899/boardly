import type { PrismaClient } from '@prisma/client'
import type { CreateBoardInput, UpdateBoardInput } from '@boardly/shared'

export class BoardsService {
  constructor(private prisma: PrismaClient) {}

  async listForUser(userId: string) {
    const memberships = await this.prisma.boardMember.findMany({
      where: { userId },
      include: {
        board: true,
      },
      orderBy: { board: { updatedAt: 'desc' } },
    })
    return memberships.map((m) => m.board)
  }

  async getById(boardId: string) {
    const board = await this.prisma.board.findUnique({
      where: { id: boardId },
      include: {
        groups: {
          orderBy: { order: 'asc' },
          include: {
            items: {
              orderBy: { order: 'asc' },
              include: {
                columnValues: true,
              },
            },
          },
        },
        columns: {
          orderBy: { order: 'asc' },
        },
        members: {
          include: {
            user: {
              select: { id: true, name: true, email: true },
            },
          },
        },
      },
    })

    if (!board) {
      throw Object.assign(new Error('Board not found'), { statusCode: 404 })
    }

    return board
  }

  async create(userId: string, input: CreateBoardInput) {
    const board = await this.prisma.board.create({
      data: {
        name: input.name,
        members: {
          create: { userId, role: 'owner' },
        },
        groups: {
          create: [
            { name: 'Group 1', color: '#579bfc', order: 0 },
          ],
        },
        columns: {
          create: [
            {
              name: 'Status',
              type: 'status',
              order: 0,
              settings: {
                labels: {
                  todo: { color: '#c4c4c4', label: 'To Do' },
                  in_progress: { color: '#fdab3d', label: 'Working on it' },
                  done: { color: '#00c875', label: 'Done' },
                  stuck: { color: '#e2445c', label: 'Stuck' },
                },
              },
            },
          ],
        },
      },
    })
    return board
  }

  async update(boardId: string, input: UpdateBoardInput) {
    return this.prisma.board.update({
      where: { id: boardId },
      data: input,
    })
  }

  async delete(boardId: string) {
    await this.prisma.board.delete({ where: { id: boardId } })
  }
}
