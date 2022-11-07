import { initTRPC } from "@trpc/server";
import { prisma } from "..";
export const t = initTRPC.create();

export const documentsRouter = t.router({
  getSingleDocument: t.procedure.query(async () => {
    return await prisma.documents.findMany();
  }),
});

export type DocumentsRouter = typeof documentsRouter;
