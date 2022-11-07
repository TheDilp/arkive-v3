import fastify, { FastifyRequest } from "fastify";
import cors from "@fastify/cors";
import { PrismaClient } from "@prisma/client";
import { initTRPC } from "@trpc/server";
import { projectsRouter } from "./routers/ProjectRouter";
import { documentsRouter } from "./routers/DocumentRouter";

const t = initTRPC.create();
export const middleware = t.middleware;
export const router = t.router;
export const publicProcedure = t.procedure;

export const prisma = new PrismaClient();

const appRouter = router({
  document: documentsRouter,
  project: projectsRouter,
});
const server = fastify({
  maxParamLength: 5000,
});

server.register(cors, {
  origin: (origin, cb) => {
    const hostname = new URL(origin).hostname;
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      //  Request from localhost will pass
      cb(null, true);
      return;
    }
    // Generate an error on other origins, disabling access
    cb(new Error("Not allowed"), false);
  },
});

server.get("/getAllProjects", async () => {
  const data = await prisma.projects.findMany({});
  return data;
});

server.post("/createProject", async () => {
  const newProject = await prisma.projects.create({ data: {} });
  return newProject;
});

server.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});

export type AppRouter = typeof appRouter;
