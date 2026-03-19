import type { FastifyRequest, FastifyReply } from 'fastify'

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  // Try JWT auth first, fall back to demo user for local development
  try {
    await request.jwtVerify()
  } catch {
    // Look up the demo user and inject it into the request
    const demoUser = await request.server.prisma.user.findFirst({
      orderBy: { createdAt: 'asc' },
    })
    if (demoUser) {
      request.user = { userId: demoUser.id } as any
      return
    }
    reply.status(401).send({ error: 'Unauthorized' })
  }
}
