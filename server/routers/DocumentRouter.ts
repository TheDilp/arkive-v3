import { FastifyInstance, FastifyRequest } from "fastify";
import { prisma } from "..";
import { removeNull } from "../utils/transform";

export const documentRouter = (server: FastifyInstance, _: any, done: any) => {
  server.get("/getalldocuments/:project_id", async (req: FastifyRequest<{ Params: { project_id: string } }>) => {
    const data = await prisma.documents.findMany({
      where: {
        project_id: req.params.project_id,
      },
    });
    return data;
  });

  server.get("/getsingledocument/:id", async (req: FastifyRequest<{ Params: { id: string } }>) => {
    return await prisma.documents.findUnique({
      where: { id: req.params.id },
    });
  });

  server.post(
    "/createdocument",
    async (
      req: FastifyRequest<{
        Body: string;
      }>,
    ) => {
      try {
        const newDocument = await prisma.documents.create({
          data: removeNull(JSON.parse(req.body)) as any,
        });

        return newDocument;
      } catch (error) {
        console.log(error);
      }
    },
  );
  server.post(
    "/updatedocument/:id",
    async (
      req: FastifyRequest<{
        Body: string;
        Params: { id: string };
      }>,
    ) => {
      try {
        const newDocument = await prisma.documents.update({
          data: removeNull(JSON.parse(req.body)) as any,
          where: { id: req.params.id },
        });
        return newDocument;
      } catch (error) {
        console.log(error);
      }
    },
  );
  server.post("/sortdocuments", async (req: FastifyRequest<{ Body: string }>) => {
    const indexes: { id: string; parent: string; sort: number }[] = JSON.parse(req.body);
    const updates = indexes.map((idx) =>
      prisma.documents.update({ data: { parent: idx.parent, sort: idx.sort }, where: { id: idx.id } }),
    );
    await prisma.$transaction(updates);
  });
  server.delete(
    "/deletedocument/:id",
    async (
      req: FastifyRequest<{
        Params: { id: string };
      }>,
    ) => {
      await prisma.documents.deleteMany({
        where: {
          parent: req.params.id,
        },
      });
      const newDocument = await prisma.documents.delete({
        where: { id: req.params.id },
      });
      return newDocument;
    },
  );

  done();
};
