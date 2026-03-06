import type { PrismaClient } from '@prisma/client'
import type { CreateColumnInput, UpdateColumnInput } from '@boardly/shared'

export class ColumnsService {
  constructor(private prisma: PrismaClient) {}

  async create(boardId: string, input: CreateColumnInput) {
    const maxOrder = await this.prisma.column.aggregate({
      where: { boardId },
      _max: { order: true },
    })

    return this.prisma.column.create({
      data: {
        boardId,
        name: input.name,
        type: input.type,
        order: (maxOrder._max.order ?? -1) + 1,
        settings: (input.settings as any) ?? {},
      },
    })
  }

  async update(columnId: string, input: UpdateColumnInput) {
    return this.prisma.column.update({
      where: { id: columnId },
      data: {
        ...(input.name && { name: input.name }),
        ...(input.settings && { settings: input.settings as any }),
      },
    })
  }

  async delete(columnId: string) {
    await this.prisma.column.delete({ where: { id: columnId } })
  }
}
