import Fastify from 'fastify'
import cookie from '@fastify/cookie'
import { env } from './config/env.js'
import prismaPlugin from './plugins/prisma.js'
import jwtPlugin from './plugins/jwt.js'
import corsPlugin from './plugins/cors.js'
import authRoutes from './modules/auth/auth.routes.js'
import boardRoutes from './modules/boards/boards.routes.js'
import groupRoutes from './modules/groups/groups.routes.js'
import itemRoutes from './modules/items/items.routes.js'
import columnRoutes from './modules/columns/columns.routes.js'
import { ZodError } from 'zod'

const app = Fastify({ logger: true })

app.register(cookie)
app.register(corsPlugin)
app.register(prismaPlugin)
app.register(jwtPlugin)

app.register(authRoutes)
app.register(boardRoutes)
app.register(groupRoutes)
app.register(itemRoutes)
app.register(columnRoutes)

// Health check endpoint with detailed status
app.get('/health', async (request, reply) => {
  const startTime = Date.now()
  let dbStatus = 'unknown'
  let dbLatency = 0

  try {
    // Check database connection
    const dbStart = Date.now()
    await app.prisma.$queryRaw`SELECT 1`
    dbLatency = Date.now() - dbStart
    dbStatus = 'connected'
  } catch (error) {
    dbStatus = 'disconnected'
    app.log.warn('Database health check failed:', error)
  }

  const totalLatency = Date.now() - startTime

  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: env.NODE_ENV,
    version: '0.0.1',
    database: {
      status: dbStatus,
      latency: `${dbLatency}ms`,
    },
    server: {
      port: env.PORT,
      latency: `${totalLatency}ms`,
    },
  }
})

// Quick health check for load balancers
app.get('/ping', async () => ({ pong: true }))

app.setErrorHandler((error, _request, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({ error: 'Validation error', details: error.flatten() })
  }
  const statusCode = (error as Record<string, unknown>).statusCode as number || 500
  reply.status(statusCode).send({ error: error.message })
})

const start = async () => {
  try {
    await app.listen({ port: env.PORT, host: '0.0.0.0' })
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()
