import type { PrismaClient } from '@prisma/client'
import '@fastify/jwt'

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient
  }
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: { userId: string }
    user: { userId: string }
  }
}
