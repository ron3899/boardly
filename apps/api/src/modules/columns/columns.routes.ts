import type { FastifyInstance } from 'fastify'
import { createColumnSchema, updateColumnSchema } from '@boardly/shared'
import { ColumnsService } from './columns.service.js'
import { authenticate } from '../../hooks/authenticate.js'
import { checkBoardMember } from '../../hooks/check-board-member.js'

export default async function columnRoutes(app: FastifyInstance) {
  const service = new ColumnsService(app.prisma)

  app.addHook('preHandler', authenticate)

  app.post('/boards/:boardId/columns', { preHandler: [checkBoardMember] }, async (request, reply) => {
    const { boardId } = request.params as { boardId: string }
    const input = createColumnSchema.parse(request.body)
    const column = await service.create(boardId, input)
    return reply.status(201).send({ column })
  })

  app.patch('/columns/:id', async (request) => {
    const { id } = request.params as { id: string }
    const input = updateColumnSchema.parse(request.body)
    const column = await service.update(id, input)
    return { column }
  })

  app.delete('/columns/:id', async (request) => {
    const { id } = request.params as { id: string }
    await service.delete(id)
    return { ok: true }
  })
}
