import { PrismaClient } from '@prisma/client'
import fp from 'fastify-plugin'
import type { FastifyInstance } from 'fastify'

export default fp(async (app: FastifyInstance) => {
  try {
    // Check if DATABASE_URL is configured
    if (!process.env.DATABASE_URL) {
      console.warn('[Prisma] No DATABASE_URL configured, skipping Prisma connection')
      // Register a no-op prisma decorator so the app still boots
      app.decorate('prisma', null)
      return
    }

    const prisma = new PrismaClient()
    await prisma.$connect()
    app.decorate('prisma', prisma)
    app.addHook('onClose', async () => {
      await prisma.$disconnect()
    })
    console.log('[Prisma] Connected successfully')
  } catch (error) {
    console.warn('[Prisma] Failed to connect:', error instanceof Error ? error.message : error)
    // Register a no-op prisma decorator so the app still boots
    app.decorate('prisma', null)
  }
})
