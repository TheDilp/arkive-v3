import { FastifyInstance, FastifyRequest } from "fastify";

import { prisma } from "..";

export const tagRouter = (server: FastifyInstance, _: any, done: any) => {
  server.get("/alltags/:project_id", async (req: FastifyRequest<{ Params: { project_id: string }; Body: string }>) => {
    const { project_id } = req.params;
    const tags = await prisma.tags.findMany({
      where: {
        project_id,
      },
      select: {
        id: true,
        title: true,
      },
    });
    return tags;
  });
  done();
};
