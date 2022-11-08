// import { initTRPC } from "@trpc/server";
// import { prisma } from "..";
// import { z } from "zod";
// import { jsonSchema } from "../context";
// import { Prisma } from "@prisma/client";
// export const t = initTRPC.create();

// export const documentsRouter = t.router({
//   getSingleDocument: t.procedure.query(async () => {
//     return await prisma.documents.findMany();
//   }),
//   createDocument: t.procedure
//     .input(
//       z.object({
//         id: z.string(),
//         title: z.string(),
//         icon: z.string().nullish(),
//         parent: z.string().nullish(),
//         project_id: z.string(),
//       })
//     )
//     .mutation(async (red) => {
//       const newDocument = await prisma.documents.create({ data: red.input });

//       return newDocument;
//     }),

//   updateDocument: t.procedure
//     .input(
//       z.object({
//         id: z.string(),
//         title: z.string(),
//         content: z.any(),
//         icon: z.string().nullish(),
//         parent: z.string().nullish(),
//         expanded: z.boolean().optional(),
//         folder: z.boolean().optional(),
//         template: z.boolean().optional(),
//         public: z.boolean().optional(),
//         sort: z.number().optional(),
//         properties: z.any(),
//         alter_names: z.array(z.string()),
//       })
//     )
//     .mutation(async (red) => {
//       const updatedDocument = await prisma.documents.update({
//         where: {
//           id: red.input.id,
//         },
//         data: red.input,
//       });

//       return updatedDocument;
//     }),
// });

// export type DocumentsRouter = typeof documentsRouter;

import { FastifyInstance, FastifyRequest } from "fastify";
import { prisma } from "..";

export const documentRouter = (server: FastifyInstance, _: any, done: any) => {
  server.get(
    "/getAllDocuments/:project_id",
    async (req: FastifyRequest<{ Params: { project_id: string } }>) => {
      const data = await prisma.documents.findMany({
        where: {
          project_id: req.params.project_id,
        },
      });
      return data;
    }
  );

  server.get(
    "/getSingleDocument/:id",
    async (req: FastifyRequest<{ Params: { id: string } }>) => {
      return await prisma.documents.findUnique({
        where: { id: req.params.id },
      });
    }
  );

  server.post(
    "/createDocument",
    async (
      req: FastifyRequest<{
        Body: string;
      }>
    ) => {
      const newDocument = await prisma.documents.create({
        data: JSON.parse(req.body),
      });

      return newDocument;
    }
  );
  server.post(
    "/updateDocument/:id",
    async (
      req: FastifyRequest<{
        Body: string;
        Params: { id: string };
      }>
    ) => {
      const newDocument = await prisma.documents.update({
        where: { id: req.params.id },
        data: JSON.parse(req.body),
      });
      console.log(newDocument);
      return newDocument;
    }
  );

  done();
};
