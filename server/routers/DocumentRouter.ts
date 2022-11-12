import { FastifyInstance, FastifyRequest } from "fastify";
import { prisma } from "..";
import { removeNull } from "../utils/transform";

export const documentRouter = (server: FastifyInstance, _: any, done: any) => {
  server.get(
    "/getalldocuments/:project_id",
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
    "/getsingledocument/:id",
    async (req: FastifyRequest<{ Params: { id: string } }>) => {
      return await prisma.documents.findUnique({
        where: { id: req.params.id },
      });
    }
  );

  server.post(
    "/createdocument",
    async (
      req: FastifyRequest<{
        Body: string;
      }>
    ) => {
      try {
        const newDocument = await prisma.documents.create({
          data: removeNull(JSON.parse(req.body)) as any,
        });

        return newDocument;
      } catch (error) {
        console.log(error);
      }
    }
  );
  server.post(
    "/updatedocuments/:id",
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
      return newDocument;
    }
  );
  server.delete(
    "/deletedocument/:id",
    async (
      req: FastifyRequest<{
        Params: { id: string };
      }>
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
    }
  );

  done();
};
