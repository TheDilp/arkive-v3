import { FastifyInstance, FastifyRequest } from "fastify";

import { prisma } from "..";
import { removeNull } from "../utils/transform";

export const mapRouter = (server: FastifyInstance, _: any, done: any) => {
  server.get("/getallmaps/:project_id", async (req: FastifyRequest<{ Params: { project_id: string } }>) => {
    const data = await prisma.maps.findMany({
      include: {
        map_pins: true,
        map_layers: true,
      },
      where: {
        project_id: req.params.project_id,
      },
    });
    return data;
  });

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
      return null;
    },
  );
  server.post(
    "/createmappin",
    async (
      req: FastifyRequest<{
        Body: string;
      }>,
    ) => {
      try {
        const newMapPin = await prisma.map_pins.create({
          data: JSON.parse(req.body) as any,
        });

        return newMapPin;
      } catch (error) {
        console.log(error);
      }
      return null;
    },
  );
  server.post(
    "/createmaplayer",
    async (
      req: FastifyRequest<{
        Body: string;
      }>,
    ) => {
      try {
        const newMapLayer = await prisma.map_layers.create({
          data: JSON.parse(req.body) as any,
        });

        return newMapLayer;
      } catch (error) {
        console.log(error);
      }
      return null;
    },
  );
  server.post(
    "/updatemappin/:id",
    async (
      req: FastifyRequest<{
        Body: string;
        Params: { id: string };
      }>,
    ) => {
      try {
        const updatedMapPin = await prisma.map_pins.update({
          data: removeNull(JSON.parse(req.body)) as any,
          where: { id: req.params.id },
        });
        return updatedMapPin;
      } catch (error: any) {
        console.log(error);
        return new Error(error);
      }
    },
  );
  server.post(
    "/updatemaplayer/:id",
    async (
      req: FastifyRequest<{
        Body: string;
        Params: { id: string };
      }>,
    ) => {
      try {
        const updatedMapLayer = await prisma.map_layers.update({
          data: removeNull(JSON.parse(req.body)) as any,
          where: { id: req.params.id },
        });
        return updatedMapLayer;
      } catch (error: any) {
        console.log(error);
        return new Error(error);
      }
    },
  );
  server.post(
    "/updatemap/:id",
    async (
      req: FastifyRequest<{
        Body: string;
        Params: { id: string };
      }>,
    ) => {
      try {
        const updatedMap = await prisma.maps.update({
          data: removeNull(JSON.parse(req.body)) as any,
          where: { id: req.params.id },
        });
        return updatedMap;
      } catch (error: any) {
        console.log(error);
        return new Error(error);
      }
    },
  );
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
