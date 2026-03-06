import fp from 'fastify-plugin'
import fastifyJwt from '@fastify/jwt'
import type { FastifyInstance } from 'fastify'
import { env } from '../config/env.js'

export default fp(async (app: FastifyInstance) => {
  app.register(fastifyJwt, {
    secret: env.JWT_SECRET,
    cookie: {
      cookieName: 'token',
      signed: false,
    },
  })
})
