import { initTRPC } from "@trpc/server";
import { prisma } from "..";
import { z } from "zod";
import { jsonSchema } from "../context";
import { Prisma } from "@prisma/client";
export const t = initTRPC.create();

export const documentsRouter = t.router({
  getSingleDocument: t.procedure.query(async () => {
    return await prisma.documents.findMany();
  }),
  createDocument: t.procedure
    .input(
      z.object({
        id: z.string(),
        title: z.string(),
        icon: z.string().nullish(),
        parent: z.string().nullish(),
        project_id: z.string(),
      })
    )
    .mutation(async (red) => {
      const newDocument = await prisma.documents.create({ data: red.input });

      return newDocument;
    }),

  updateDocument: t.procedure
    .input(
      z.object({
        id: z.string(),
        title: z.string(),
        content: z.any(),
        icon: z.string().nullish(),
        parent: z.string().nullish(),
        expanded: z.boolean().optional(),
        folder: z.boolean().optional(),
        template: z.boolean().optional(),
        public: z.boolean().optional(),
        sort: z.number().optional(),
        properties: z.any(),
        alter_names: z.array(z.string()),
      })
    )
    .mutation(async (red) => {
      const updatedDocument = await prisma.documents.update({
        where: {
          id: red.input.id,
        },
        data: red.input,
      });

      return updatedDocument;
    }),
});

export type DocumentsRouter = typeof documentsRouter;
