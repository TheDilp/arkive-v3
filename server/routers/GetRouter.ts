import { FastifyInstance, FastifyRequest } from "fastify";
import { prisma } from "..";
import { AvailableTypes } from "../types/dataTypes";
import { onlyUniqueStrings, removeNull } from "../utils/transform";

export const getRouter = (server: FastifyInstance, _: any, done: any) => {
  server.get(
    "/alltags/:type/:project_id",
    async (req: FastifyRequest<{ Params: { type: AvailableTypes; project_id: string } }>) => {
      const { type, project_id } = req.params;
      try {
        if (type === "documents") {
          const data = await prisma.documents.findMany({
            select: {
              tags: true,
            },
            where: {
              project_id,
            },
          });
          return data
            .map((obj: { tags: string[] }) => obj.tags)
            .flat()
            .filter(onlyUniqueStrings);
        } else if (type === "maps") {
          const data = await prisma.maps.findMany({
            select: {
              tags: true,
            },
            where: {
              project_id,
            },
          });
          return data
            .map((obj: { tags: string[] }) => obj.tags)
            .flat()
            .filter(onlyUniqueStrings);
        }
      } catch (error) {
        console.log(error);
      }
    },
  );

  done();
};
