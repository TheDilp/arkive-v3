import { FastifyInstance, FastifyRequest } from "fastify";
import { prisma } from "..";

export const projectRouter = (server: FastifyInstance, _: any, done: any) => {
  server.get("/getallprojects", async () => {
    const data = await prisma.projects.findMany({});
    return data;
  });
  server.get(
    "/getsingleproject/:id",
    async (req: FastifyRequest<{ Params: { id: string } }>) => {
      const singleProject = await prisma.projects.findUnique({
        where: {
          id: req.params.id,
        },
      });
      return singleProject;
    }
  );

  server.post("/createproject", async () => {
    const newProject = await prisma.projects.create({ data: {} });
    return newProject;
  });

  done();
};
