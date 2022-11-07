import { initTRPC } from "@trpc/server";
import { prisma } from "..";
import { z } from "zod";
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
        parent: z.string().nullish(),
        project_id: z.string(),
      })
    )
    .mutation(async (red) => {
      const newDocument = await prisma.documents.create({ data: red.input });

      return newDocument;
    }),
});

export type DocumentsRouter = typeof documentsRouter;
