import { FastifyInstance, FastifyRequest } from "fastify";

import { prisma } from "..";
import { AvailableTypes } from "../types/dataTypes";
import { onlyUniqueStrings } from "../utils/transform";

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
        }
        if (type === "maps") {
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
        if (type === "boards") {
          const data = await prisma.boards.findMany({
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
      return [];
    },
  );
  server.post("/fullsearch/:project_id", async (req: FastifyRequest<{ Params: { project_id: string }; Body: string }>) => {
    const { project_id } = req.params;
    const { query } = JSON.parse(req.body) as { query: string };
    const documents = await prisma.$queryRaw`
select id,title from documents where (project_id::text = ${project_id} and (lower(content->>'content'::text) like lower(${`%${query}%`}) or lower(title) like lower(${`%${query}%`})) and folder = false)
;`;
    const maps = await prisma.maps.findMany({
      where: {
        title: {
          startsWith: query,
          mode: "insensitive",
        },
        folder: false,
      },
    });
    const pins = await prisma.map_pins.findMany({
      where: {
        text: {
          startsWith: query,
          mode: "insensitive",
        },
      },
    });
    const boards = await prisma.boards.findMany({
      where: {
        title: {
          startsWith: query,
          mode: "insensitive",
        },
        folder: false,
      },
    });
    const nodes = await prisma.nodes.findMany({
      where: {
        label: {
          startsWith: query,
          mode: "insensitive",
        },
      },
    });
    return [documents, maps, pins, boards, nodes].flat();
  });
  done();
};
