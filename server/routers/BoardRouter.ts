import { FastifyInstance, FastifyRequest } from "fastify";

import { prisma } from "..";
import { removeNull } from "../utils/transform";

export const boardRouter = (server: FastifyInstance, _: any, done: any) => {
  server.get("/getallboards/:project_id", async (req: FastifyRequest<{ Params: { project_id: string } }>) => {
    const data = await prisma.boards.findMany({
      where: {
        project_id: req.params.project_id,
      },
      include: {
        nodes: true,
        edges: true,
      },
    });
    return data;
  });
  server.post(
    "/createboard",
    async (
      req: FastifyRequest<{
        Body: string;
      }>,
    ) => {
      try {
        const newDocument = await prisma.boards.create({
          data: removeNull(JSON.parse(req.body)) as any,
        });

        return newDocument;
      } catch (error) {
        console.log(error);
      }
      return null;
    },
  );
  server.post(
    "/updateboard/:id",
    async (
      req: FastifyRequest<{
        Body: string;
        Params: { id: string };
      }>,
    ) => {
      try {
        const newDocument = await prisma.boards.update({
          where: {
            id: req.params.id,
          },
          data: removeNull(JSON.parse(req.body)) as any,
        });

        return newDocument;
      } catch (error) {
        console.log(error);
      }
      return null;
    },
  );
  server.post(
    "/createnode",
    async (
      req: FastifyRequest<{
        Body: string;
        Params: { id: string };
      }>,
    ) => {
      try {
        const newNode = await prisma.nodes.create({
          data: removeNull(JSON.parse(req.body)) as any,
        });

        return newNode;
      } catch (error) {
        console.log(error);
      }
      return null;
    },
  );
  server.delete(
    "/deletemanynodes",
    async (
      req: FastifyRequest<{
        Body: string;
      }>,
    ) => {
      try {
        const ids: string[] = JSON.parse(req.body);
        await prisma.edges.deleteMany({
          where: {
            OR: [
              {
                source_id: {
                  in: ids,
                },
              },
              {
                target_id: {
                  in: ids,
                },
              },
            ],
          },
        });
        await prisma.nodes.deleteMany({
          where: {
            id: {
              in: ids,
            },
          },
        });
        return true;
      } catch (error) {
        console.log(error);
      }
      return null;
    },
  );
  server.post(
    "/updatemanynodes",
    async (
      req: FastifyRequest<{
        Body: string;
      }>,
    ) => {
      try {
        const body: { ids: string[]; data: any } = JSON.parse(req.body);
        await prisma.nodes.updateMany({
          where: {
            id: {
              in: body.ids,
            },
          },
          data: removeNull(body.data) as any,
        });
        const updatedNodes = await prisma.nodes.findMany({
          where: {
            id: {
              in: body.ids,
            },
          },
        });

        return updatedNodes;
      } catch (error) {
        console.log(error);
      }
      return null;
    },
  );
  server.post(
    "/updatenode/:id",
    async (
      req: FastifyRequest<{
        Body: string;
        Params: { id: string };
      }>,
    ) => {
      try {
        const updatedNode = await prisma.nodes.update({
          where: {
            id: req.params.id,
          },
          data: removeNull(JSON.parse(req.body)) as any,
        });

        return updatedNode;
      } catch (error) {
        console.log(error);
      }
      return null;
    },
  );
  server.post(
    "/createedge",
    async (
      req: FastifyRequest<{
        Body: string;
        Params: { id: string };
      }>,
    ) => {
      try {
        const newEdge = await prisma.edges.create({
          data: removeNull(JSON.parse(req.body)) as any,
        });

        return newEdge;
      } catch (error) {
        console.log(error);
      }
      return null;
    },
  );
  server.post(
    "/updateedge/:id",
    async (
      req: FastifyRequest<{
        Body: string;
        Params: { id: string };
      }>,
    ) => {
      try {
        const newDocument = await prisma.edges.update({
          where: {
            id: req.params.id,
          },
          data: removeNull(JSON.parse(req.body)) as any,
        });

        return newDocument;
      } catch (error) {
        console.log(error);
      }
      return null;
    },
  );

  done();
};
