import fp from 'fastify-plugin';
import { PrismaClient } from '@prisma/client';
import { FastifyInstance } from 'fastify';

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}

export default fp(async (app: FastifyInstance) => {
  if (process.env.MOCK_AUTH === 'true') {
    // Decorate with a no-op proxy so nothing breaks at runtime
    app.decorate('prisma', new Proxy({} as PrismaClient, {
      get: () => () => Promise.resolve(null),
    }));
    return;
  }
  const prisma = new PrismaClient();
  await prisma.$connect();
  app.decorate('prisma', prisma);
  app.addHook('onClose', async () => {
    await prisma.$disconnect();
  });
});
