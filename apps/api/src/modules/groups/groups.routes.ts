import type { FastifyInstance } from 'fastify'
import { createGroupSchema, updateGroupSchema, reorderGroupsSchema } from '@boardly/shared'
import { GroupsService } from './groups.service.js'
import { authenticate } from '../../hooks/authenticate.js'
import { checkBoardMember } from '../../hooks/check-board-member.js'

export default async function groupRoutes(app: FastifyInstance) {
  const service = new GroupsService(app.prisma)

  app.addHook('preHandler', authenticate)

  app.post('/boards/:boardId/groups', { preHandler: [checkBoardMember] }, async (request, reply) => {
    const { boardId } = request.params as { boardId: string }
    const input = createGroupSchema.parse(request.body)
    const group = await service.create(boardId, input)
    return reply.status(201).send({ group })
  })

  app.patch('/groups/:id', async (request) => {
    const { id } = request.params as { id: string }
    const input = updateGroupSchema.parse(request.body)
    const group = await service.update(id, input)
    return { group }
  })

  app.delete('/groups/:id', async (request) => {
    const { id } = request.params as { id: string }
    await service.delete(id)
    return { ok: true }
  })

  app.patch('/groups/reorder', async (request) => {
    const items = reorderGroupsSchema.parse(request.body)
    await service.reorder(items)
    return { ok: true }
  })
}
