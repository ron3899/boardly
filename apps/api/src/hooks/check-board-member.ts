import type { FastifyRequest, FastifyReply } from 'fastify'

export async function checkBoardMember(request: FastifyRequest, reply: FastifyReply) {
  const params = request.params as Record<string, string>
  const boardId = params.boardId || params.id

  if (!boardId) return

  const member = await request.server.prisma.boardMember.findUnique({
    where: {
      boardId_userId: {
        boardId,
        userId: request.user.userId,
      },
    },
  })

  if (!member) {
    reply.status(403).send({ error: 'Not a board member' })
  }
}
