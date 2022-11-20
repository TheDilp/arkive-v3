import { FastifyInstance, FastifyRequest } from "fastify";
import { prisma } from "..";
import { removeNull } from "../utils/transform";

export const mapRouter = (server: FastifyInstance, _: any, done: any) => {
  server.get("/getallmaps/:project_id", async (req: FastifyRequest<{ Params: { project_id: string } }>) => {
    const data = await prisma.maps.findMany({
      where: {
        project_id: req.params.project_id,
      },
    });
    return data;
  });

  //   server.get("/getsingledocument/:id", async (req: FastifyRequest<{ Params: { id: string } }>) => {
  //     return await prisma.documents.findUnique({
  //       where: { id: req.params.id },
  //     });
  //   });

  server.post(
    "/createmap",
    async (
      req: FastifyRequest<{
        Body: string;
      }>,
    ) => {
      try {
        const newMap = await prisma.maps.create({
          data: JSON.parse(req.body) as any,
        });

        return newMap;
      } catch (error) {
        console.log(error);
      }
    },
  );
  //   server.post(
  //     "/updatedocument/:id",
  //     async (
  //       req: FastifyRequest<{
  //         Body: string;
  //         Params: { id: string };
  //       }>,
  //     ) => {
  //       try {
  //         const newDocument = await prisma.documents.update({
  //           data: removeNull(JSON.parse(req.body)) as any,
  //           where: { id: req.params.id },
  //         });
  //         return newDocument;
  //       } catch (error) {
  //         console.log(error);
  //       }
  //     },
  //   );
  server.post("/sortmaps", async (req: FastifyRequest<{ Body: string }>) => {
    const indexes: { id: string; parent: string; sort: number }[] = JSON.parse(req.body);
    const updates = indexes.map((idx) =>
      prisma.maps.update({ data: { parent: idx.parent, sort: idx.sort }, where: { id: idx.id } }),
    );
    await prisma.$transaction(updates);
  });
  server.delete(
    "/deletemap/:id",
    async (
      req: FastifyRequest<{
        Params: { id: string };
      }>,
    ) => {
      await prisma.maps.deleteMany({
        where: {
          parent: req.params.id,
        },
      });
      const newDocument = await prisma.maps.delete({
        where: { id: req.params.id },
      });
      return newDocument;
    },
  );

  done();
};
