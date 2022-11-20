import { FastifyInstance, FastifyRequest } from "fastify";
import { prisma } from "..";
import { AvailableTypes } from "../types/dataTypes";
import { onlyUniqueStrings, removeNull } from "../utils/transform";

export const getRouter = (server: FastifyInstance, _: any, done: any) => {
  server.get("/alltags/:project_id", async (req: FastifyRequest<{ Params: { project_id: string } }>) => {
    try {
      const data = await prisma.documents.findMany({
        select: {
          tags: true,
        },
        where: {
          project_id: req.params.project_id,
        },
      });
      return data
        .map((obj: { tags: string[] }) => obj.tags)
        .flat()
        .filter(onlyUniqueStrings);
    } catch (error) {
      console.log(error);
    }
  });

  done();
};
