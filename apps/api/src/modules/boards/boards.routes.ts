import type { FastifyInstance } from 'fastify'
import { createBoardSchema, updateBoardSchema } from '@boardly/shared'
import { BoardsService } from './boards.service.js'
import { authenticate } from '../../hooks/authenticate.js'
import { checkBoardMember } from '../../hooks/check-board-member.js'

export default async function boardRoutes(app: FastifyInstance) {
  const service = new BoardsService(app.prisma)

  app.addHook('preHandler', authenticate)

  app.get('/boards', async (request) => {
    const boards = await service.listForUser(request.user.userId)
    return { boards }
  })

  app.post('/boards', async (request, reply) => {
    const input = createBoardSchema.parse(request.body)
    const board = await service.create(request.user.userId, input)
    return reply.status(201).send({ board })
  })

  app.get('/boards/:id', { preHandler: [checkBoardMember] }, async (request) => {
    const { id } = request.params as { id: string }
    const board = await service.getById(id)
    return { board }
  })

  app.patch('/boards/:id', { preHandler: [checkBoardMember] }, async (request) => {
    const { id } = request.params as { id: string }
    const input = updateBoardSchema.parse(request.body)
    const board = await service.update(id, input)
    return { board }
  })

  app.delete('/boards/:id', { preHandler: [checkBoardMember] }, async (request) => {
    const { id } = request.params as { id: string }
    await service.delete(id)
    return { ok: true }
  })
}
