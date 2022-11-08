import { FastifyInstance, FastifyRequest } from "fastify";
import { prisma } from "..";

export const projectRouter = (server: FastifyInstance, _: any, done: any) => {
  server.get("/getAllProjects", async () => {
    const data = await prisma.projects.findMany({});
    return data;
  });
  server.get(
    "/getSingleProject/:id",
    async (req: FastifyRequest<{ Params: { id: string } }>) => {
      const singleProject = await prisma.projects.findUnique({
        where: {
          id: req.params.id,
        },
        include: {
          documents: true,
        },
      });
      return singleProject;
    }
  );

  server.post("/createProject", async () => {
    const newProject = await prisma.projects.create({ data: {} });
    return newProject;
  });

  done();
};
