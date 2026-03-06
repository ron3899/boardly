import type { FastifyInstance } from 'fastify'
import { registerSchema, loginSchema } from '@boardly/shared'
import { AuthService } from './auth.service.js'
import { authenticate } from '../../hooks/authenticate.js'

const isProd = process.env.NODE_ENV === 'production'

const cookieOptions = {
  path: '/',
  httpOnly: true,
  sameSite: isProd ? 'none' as const : 'lax' as const,
  secure: isProd,
  maxAge: 60 * 60 * 24 * 7,
}

export default async function authRoutes(app: FastifyInstance) {
  const service = new AuthService(app.prisma)

  app.post('/auth/register', async (request, reply) => {
    const input = registerSchema.parse(request.body)
    const user = await service.register(input)
    const token = app.jwt.sign({ userId: user.id })

    reply
      .setCookie('token', token, cookieOptions)
      .send({ user, token })
  })

  app.post('/auth/login', async (request, reply) => {
    const input = loginSchema.parse(request.body)
    const user = await service.login(input)
    const token = app.jwt.sign({ userId: user.id })

    reply
      .setCookie('token', token, cookieOptions)
      .send({ user, token })
  })

  app.get('/auth/me', { preHandler: [authenticate] }, async (request) => {
    const user = await service.getUser(request.user.userId)
    return { user }
  })

  app.post('/auth/logout', async (_request, reply) => {
    reply
      .clearCookie('token', { path: '/' })
      .send({ ok: true })
  })
}
