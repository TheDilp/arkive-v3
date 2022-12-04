import { FastifyInstance, FastifyRequest } from "fastify";

import { prisma } from "..";
import { removeNull } from "../utils/transform";

export const boardRouter = (server: FastifyInstance, _: any, done: any) => {
  server.get("/getallboards/:project_id", async (req: FastifyRequest<{ Params: { project_id: string } }>) => {
    const data = await prisma.boards.findMany({
      where: {
        project_id: req.params.project_id,
      },
    });
    return data;
  });
  server.post(
    "/createboard",
    async (
      req: FastifyRequest<{
        Body: string;
      }>,
    ) => {
      try {
        const newDocument = await prisma.boards.create({
          data: removeNull(JSON.parse(req.body)) as any,
        });

        return newDocument;
      } catch (error) {
        console.log(error);
      }
      return null;
    },
  );
  done();
};
