import fp from 'fastify-plugin'
import fastifyCors from '@fastify/cors'
import type { FastifyInstance } from 'fastify'

export default fp(async (app: FastifyInstance) => {
  // Support multiple origins: localhost:3000 (web dev server) and localhost:3001 (API server)
  // In production, CORS_ORIGIN env var should be set to the actual domain(s)
  const defaultOrigins = 'http://localhost:3000,http://localhost:3001'
  const origins = (process.env.CORS_ORIGIN || defaultOrigins).split(',').map(o => o.trim())

  app.register(fastifyCors, {
    origin: origins,
    credentials: true,
  })
})
