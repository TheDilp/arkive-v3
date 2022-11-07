import { initTRPC } from "@trpc/server";
import { prisma } from "..";
import { z } from "zod";
export const t = initTRPC.create();

export const projectsRouter = t.router({
  getAllProjects: t.procedure.query(async () => {
    const data = await prisma.projects.findMany({});
    return data;
  }),
  createProject: t.procedure
    .input(z.object({ id: z.string(), title: z.string() }))
    .mutation(async (req) => {
      const newProject = await prisma.projects.create({ data: req.input });
      return newProject;
    }),
});

export type ProjectsRouter = typeof projectsRouter;
