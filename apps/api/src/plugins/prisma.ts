import { PrismaClient } from '@prisma/client'
import fp from 'fastify-plugin'
import type { FastifyInstance } from 'fastify'
import { env } from '../config/env.js'

export default fp(async (app: FastifyInstance) => {
  // Skip Prisma setup in mock mode
  if (env.MOCK_AUTH) {
    app.decorate('prisma', null)
    return
  }

  const prisma = new PrismaClient()
  await prisma.$connect()
  app.decorate('prisma', prisma)
  app.addHook('onClose', async () => {
    await prisma.$disconnect()
  })
})
