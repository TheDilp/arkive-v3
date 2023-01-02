import { FastifyInstance, FastifyRequest } from "fastify";

import { prisma } from "..";

export const tagRouter = (server: FastifyInstance, _: any, done: any) => {
  server.get("/alltags/:project_id", async (req: FastifyRequest<{ Params: { project_id: string }; Body: string }>) => {
    const { project_id } = req.params;
    const tags = await prisma.tags.findMany({
      where: {
        project_id,
      },
      select: {
        id: true,
        title: true,
      },
    });
    return tags;
  });
  server.post("/createtag", async (req: FastifyRequest<{ Body: string }>) => {
    const { title, project_id, ...rest } = JSON.parse(req.body) as {
      project_id: string;
      title: string;
      [key: string]: any;
    };
    try {
      await prisma.tags.create({
        data: {
          title,
          project_id,
          ...rest,
        },
      });
    } catch (error) {
      console.log(error);
    }
    return true;
  });
  server.post("/updatetag/:id", async (req: FastifyRequest<{ Params: { id: string }; Body: string }>) => {
    const { id } = req.params;
    const { title, ...rest } = JSON.parse(req.body) as {
      title: string;
      [key: string]: any;
    };
    try {
      await prisma.tags.update({
        where: {
          id,
        },
        data: {
          title,
          ...rest,
        },
      });
      return true;
    } catch (error) {
      console.log(error);
    }
    return true;
  });

  done();
};
