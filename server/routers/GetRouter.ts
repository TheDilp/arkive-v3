import { documents as prismaDocumentsType } from "@prisma/client";
import { FastifyInstance, FastifyRequest } from "fastify";

import { prisma } from "..";
import { AvailableTypes } from "../types/dataTypes";
import { hasValueDeep, onlyUniqueStrings } from "../utils/transform";

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
        if (type === "nodes") {
          const data = await prisma.nodes.findMany({
            select: {
              tags: true,
            },
            where: {
              board: {
                project_id,
              },
            },
          });
          return data
            .map((obj: { tags: string[] }) => obj.tags)
            .flat()
            .filter(onlyUniqueStrings);
        }
        if (type === "edges") {
          const data = await prisma.edges.findMany({
            select: {
              tags: true,
            },
            where: {
              board: {
                project_id,
              },
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
  server.post("/alltags/:project_id", async (req: FastifyRequest<{ Params: { project_id: string }; Body: string }>) => {
    const { project_id } = req.params;
    const { query } = JSON.parse(req.body);
    const items = [
      prisma.documents.findMany({
        where: {
          project_id,
        },
        select: {
          tags: true,
        },
      }),
      prisma.maps.findMany({
        where: {
          project_id,
        },
        select: {
          tags: true,
        },
      }),
      prisma.boards.findMany({
        where: {
          project_id,
        },
        select: {
          tags: true,
        },
      }),
      prisma.nodes.findMany({
        where: {
          board: {
            project_id,
          },
        },
        select: {
          tags: true,
        },
      }),
      prisma.edges.findMany({
        where: {
          board: {
            project_id,
          },
        },
        select: {
          tags: true,
        },
      }),
    ];
    const tags = await prisma.$transaction(items);
    return tags
      .flat()
      .map((o) => o.tags)
      .flat()
      .filter(onlyUniqueStrings)
      .filter((tag) => tag?.toLowerCase()?.includes(query?.toLowerCase()));
  });
  server.post(
    "/fullsearch/:project_id/:type",
    async (req: FastifyRequest<{ Params: { project_id: string; type: "tags" | "namecontent" }; Body: string }>) => {
      const { project_id, type } = req.params;
      const { query } = JSON.parse(req.body) as { query: string | string[] };

      if (type === "namecontent") {
        const searches = [
          prisma.$queryRaw`
          select id,title,icon, content from documents where (project_id::text = ${project_id} and ( lower(content->>'content'::text) like lower(${`%${query}%`}) or (lower(title) like lower(${`%${query}%`}) ) ) and folder = false)
          ;`,
          prisma.maps.findMany({
            where: {
              title: {
                contains: query as string,
                mode: "insensitive",
              },
              project_id,
              folder: false,
            },
            select: {
              id: true,
              title: true,
              icon: true,
            },
          }),
          prisma.map_pins.findMany({
            where: {
              text: {
                contains: query as string,
                mode: "insensitive",
              },
              maps: {
                project_id,
              },
            },
            select: {
              id: true,
              text: true,
              parent: true,
            },
          }),
          prisma.boards.findMany({
            where: {
              title: {
                contains: query as string,
                mode: "insensitive",
              },
              folder: false,
              project_id,
            },
            select: {
              id: true,
              title: true,
              icon: true,
            },
          }),
          prisma.nodes.findMany({
            where: {
              label: {
                contains: query as string,
                mode: "insensitive",
              },
              board: {
                project_id,
              },
            },
            select: {
              id: true,
              label: true,
              parent: true,
            },
          }),
          prisma.edges.findMany({
            where: {
              label: {
                contains: query as string,
                mode: "insensitive",
              },
              board: {
                project_id,
              },
            },
            select: {
              id: true,
              label: true,
              parent: true,
            },
          }),
        ];
        const [documents, maps, pins, boards, nodes, edges] = await prisma.$transaction(searches);

        const contentSearchedDocuments = (documents as prismaDocumentsType[]).filter((doc) =>
          hasValueDeep(doc.content, query as string),
        );

        return { documents: contentSearchedDocuments, maps, pins, boards, nodes, edges };
      }
      if (type === "tags") {
        const searches = [
          prisma.documents.findMany({
            where: {
              folder: false,
              tags: {
                hasEvery: query,
              },
            },
          }),
          prisma.maps.findMany({
            where: {
              folder: false,
              tags: {
                hasEvery: query,
              },
            },
            select: {
              id: true,
              title: true,
              icon: true,
            },
          }),
          prisma.nodes.findMany({
            where: {
              tags: {
                hasEvery: query,
              },
            },
            select: {
              id: true,
              label: true,
              parent: true,
            },
          }),
          prisma.boards.findMany({
            where: {
              tags: {
                hasEvery: query,
              },
              folder: false,
            },
            select: {
              id: true,
              title: true,
              icon: true,
            },
          }),
          prisma.edges.findMany({
            where: {
              tags: {
                hasEvery: query,
              },
            },
            select: {
              id: true,
              label: true,
              parent: true,
            },
          }),
        ];
        const [documents, maps, boards, nodes, edges] = await prisma.$transaction(searches);
        return { documents, maps, boards, nodes, edges };
      }
      return {};
    },
  );
  done();
};
