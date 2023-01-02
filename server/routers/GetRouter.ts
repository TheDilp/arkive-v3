import { documents } from "@prisma/client";
import { FastifyInstance, FastifyRequest } from "fastify";

import { prisma } from "..";
import { hasValueDeep, onlyUniqueStrings } from "../utils/transform";

export const getRouter = (server: FastifyInstance, _: any, done: any) => {
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
      .map((o: { tags: string[] }) => o.tags)
      .flat()
      .filter(onlyUniqueStrings)
      .filter((tag: string) => (query ? tag?.toLowerCase()?.includes(query?.toLowerCase()) : true));
  });
  server.post(
    "/fullsearch/:project_id/:type",
    async (req: FastifyRequest<{ Params: { project_id: string; type: "tags" | "namecontent" }; Body: string }>) => {
      const { project_id, type } = req.params;
      const { query } = JSON.parse(req.body) as { query: string | string[] };

      if (type === "namecontent") {
        const searches = [
          prisma.$queryRaw`
          select id,title,content,icon from documents where (project_id::text = ${project_id} and ( lower(content->>'content'::text) like lower(${`%${query}%`}) or (lower(title) like lower(${`%${query}%`}) ) ) and folder = false)
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
              maps: {
                select: {
                  title: true,
                },
              },
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
              board: {
                select: {
                  title: true,
                },
              },
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
              board: {
                select: {
                  title: true,
                },
              },
            },
          }),
        ];
        const [titleDocuments, maps, pins, boards, nodes, edges] = await prisma.$transaction(searches);
        const contentSearchedDocuments = [...(titleDocuments as documents[])].filter(
          (doc: documents) =>
            doc.title.toLowerCase().includes((query as string).toLowerCase()) || hasValueDeep(doc.content, query as string),
        );

        // Remove and do not return content
        const final = contentSearchedDocuments.map((doc) => ({
          id: doc.id,
          title: doc.title,
          icon: doc.icon,
        }));
        return { documents: final, maps, pins, boards, nodes, edges };
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
            select: {
              id: true,
              title: true,
              icon: true,
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
        const [titleDocuments, maps, boards, nodes, edges] = await prisma.$transaction(searches);
        return { titleDocuments, maps, boards, nodes, edges };
      }
      return {};
    },
  );
  server.get("/alltags/settings/:project_id", async (req: FastifyRequest<{ Params: { project_id: string } }>) => {
    const { project_id } = req.params;
    const transactions = [
      prisma.documents.findMany({
        where: {
          project_id,
          tags: {
            isEmpty: false,
          },
        },

        select: {
          id: true,
          title: true,
          icon: true,
          tags: true,
        },
      }),
      prisma.maps.findMany({
        where: {
          project_id,
          tags: {
            isEmpty: false,
          },
        },
        select: {
          id: true,
          title: true,
          icon: true,
          tags: true,
        },
      }),
      prisma.boards.findMany({
        where: {
          project_id,
          tags: {
            isEmpty: false,
          },
        },
        select: {
          id: true,
          title: true,
          icon: true,
          tags: true,
        },
      }),
      prisma.nodes.findMany({
        where: {
          board: {
            project_id,
          },
          tags: {
            isEmpty: false,
          },
        },
        select: {
          id: true,
          label: true,
          tags: true,
        },
      }),
      prisma.edges.findMany({
        where: {
          board: {
            project_id,
          },
          tags: {
            isEmpty: false,
          },
        },
        select: {
          id: true,
          label: true,
          tags: true,
        },
      }),
    ];
    const results = await prisma.$transaction(transactions);
    return results.flat();
  });
  done();
};
