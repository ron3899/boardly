import type { PrismaClient } from '@prisma/client'
import type { CreateGroupInput, UpdateGroupInput, ReorderGroupsInput } from '@boardly/shared'

export class GroupsService {
  constructor(private prisma: PrismaClient) {}

  async create(boardId: string, input: CreateGroupInput) {
    const maxOrder = await this.prisma.group.aggregate({
      where: { boardId },
      _max: { order: true },
    })

    return this.prisma.group.create({
      data: {
        boardId,
        name: input.name,
        order: (maxOrder._max.order ?? -1) + 1,
      },
    })
  }

  async update(groupId: string, input: UpdateGroupInput) {
    return this.prisma.group.update({
      where: { id: groupId },
      data: input,
    })
  }

  async delete(groupId: string) {
    await this.prisma.group.delete({ where: { id: groupId } })
  }

  async reorder(items: ReorderGroupsInput) {
    await this.prisma.$transaction(
      items.map((item) =>
        this.prisma.group.update({
          where: { id: item.id },
          data: { order: item.order },
        })
      )
    )
  }
}
