import type { PrismaClient } from '@prisma/client'
import type { CreateItemInput, UpdateItemInput, ReorderItemsInput } from '@boardly/shared'

export class ItemsService {
  constructor(private prisma: PrismaClient) {}

  async create(groupId: string, input: CreateItemInput) {
    const maxOrder = await this.prisma.item.aggregate({
      where: { groupId },
      _max: { order: true },
    })

    const item = await this.prisma.item.create({
      data: {
        groupId,
        name: input.name,
        order: (maxOrder._max.order ?? -1) + 1,
      },
      include: { columnValues: true },
    })

    return item
  }

  async update(itemId: string, input: UpdateItemInput) {
    return this.prisma.item.update({
      where: { id: itemId },
      data: input,
      include: { columnValues: true },
    })
  }

  async delete(itemId: string) {
    await this.prisma.item.delete({ where: { id: itemId } })
  }

  async reorder(items: ReorderItemsInput) {
    await this.prisma.$transaction(
      items.map((item) =>
        this.prisma.item.update({
          where: { id: item.id },
          data: {
            order: item.order,
            ...(item.groupId && { groupId: item.groupId }),
          },
        })
      )
    )
  }

  async updateValue(itemId: string, columnId: string, value: unknown) {
    return this.prisma.columnValue.upsert({
      where: {
        itemId_columnId: { itemId, columnId },
      },
      update: { value: value as any },
      create: {
        itemId,
        columnId,
        value: value as any,
      },
    })
  }

  async getForUser(userId: string) {
    // Get all items where the user is assigned
    const items = await this.prisma.item.findMany({
      where: {
        columnValues: {
          some: {
            column: { type: 'person' },
            value: { path: '$', equals: userId },
          },
        },
      },
      include: {
        columnValues: {
          include: {
            column: true,
          },
        },
        group: {
          include: {
            board: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    })

    return items
  }
}
