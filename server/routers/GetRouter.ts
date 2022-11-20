import { FastifyInstance, FastifyRequest } from "fastify";
import { prisma } from "..";
import { AvailableTypes } from "../types/dataTypes";
import { onlyUniqueStrings, removeNull } from "../utils/transform";

export const getRouter = (server: FastifyInstance, _: any, done: any) => {
  server.get(
    "/getAll/:project_id/:type",
    async (
      req: FastifyRequest<{
        Params: { project_id: string; type: AvailableTypes };
      }>,
    ) => {
      try {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        const data = await prisma[req.params.type].findMany({
          where: {
            project_id: req.params.project_id,
          },
        });
        return data;
      } catch (error) {
        console.log(error);
      }
    },
  );
  server.get("/alltags/:project_id", async (req: FastifyRequest<{ Params: { project_id: string } }>) => {
    try {
      const data = await prisma.documents.findMany({
        select: {
          tags: true,
        },
        where: {
          project_id: req.params.project_id,
        },
      });
      return data
        .map((obj: { tags: string[] }) => obj.tags)
        .flat()
        .filter(onlyUniqueStrings);
    } catch (error) {
      console.log(error);
    }
  });
  // server.get(
  //   "/getSingleDocument/:id",
  //   async (req: FastifyRequest<{ Params: { id: string } }>) => {
  //     return await prisma.documents.findUnique({
  //       where: { id: req.params.id },
  //     });
  //   }
  // );

  // server.post(
  //   "/createDocument",
  //   async (
  //     req: FastifyRequest<{
  //       Body: string;
  //     }>
  //   ) => {
  //     try {
  //       const newDocument = await prisma.documents.create({
  //         data: removeNull(JSON.parse(req.body)) as any,
  //       });

  //       return newDocument;
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }
  // );
  // server.post(
  //   "/updateDocument/:id",
  //   async (
  //     req: FastifyRequest<{
  //       Body: string;
  //       Params: { id: string };
  //     }>
  //   ) => {
  //     const newDocument = await prisma.documents.update({
  //       where: { id: req.params.id },
  //       data: JSON.parse(req.body),
  //     });
  //     return newDocument;
  //   }
  // );
  // server.delete(
  //   "/deleteDocument/:id",
  //   async (
  //     req: FastifyRequest<{
  //       Params: { id: string };
  //     }>
  //   ) => {
  //     await prisma.documents.deleteMany({
  //       where: {
  //         parent: req.params.id,
  //       },
  //     });
  //     const newDocument = await prisma.documents.delete({
  //       where: { id: req.params.id },
  //     });
  //     return newDocument;
  //   }
  // );

  done();
};
