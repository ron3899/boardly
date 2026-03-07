import type { FastifyInstance } from 'fastify'
import { createItemSchema, updateItemSchema, reorderItemsSchema, updateColumnValueSchema } from '@boardly/shared'
import { ItemsService } from './items.service.js'
import { authenticate } from '../../hooks/authenticate.js'

export default async function itemRoutes(app: FastifyInstance) {
  const service = new ItemsService(app.prisma)

  app.addHook('preHandler', authenticate)

  app.get('/me/items', async (request) => {
    const items = await service.getForUser(request.user.userId)
    return { items }
  })

  app.post('/groups/:groupId/items', async (request, reply) => {
    const { groupId } = request.params as { groupId: string }
    const input = createItemSchema.parse(request.body)
    const item = await service.create(groupId, input)
    return reply.status(201).send({ item })
  })

  app.patch('/items/:id', async (request) => {
    const { id } = request.params as { id: string }
    const input = updateItemSchema.parse(request.body)
    const item = await service.update(id, input)
    return { item }
  })

  app.delete('/items/:id', async (request) => {
    const { id } = request.params as { id: string }
    await service.delete(id)
    return { ok: true }
  })

  app.patch('/items/reorder', async (request) => {
    const items = reorderItemsSchema.parse(request.body)
    await service.reorder(items)
    return { ok: true }
  })

  app.patch('/items/:itemId/values/:columnId', async (request) => {
    const { itemId, columnId } = request.params as { itemId: string; columnId: string }
    const { value } = updateColumnValueSchema.parse(request.body)
    const columnValue = await service.updateValue(itemId, columnId, value)
    return { columnValue }
  })
}
