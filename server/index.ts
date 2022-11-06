import fastify, { FastifyRequest } from "fastify";
import cors from "@fastify/cors";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const server = fastify();
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
server.get("/getAllProjects", async (request, reply) => {
  const allProjects = await prisma.projects.findMany();
  return { data: allProjects };
});

server.post(
  "/createProject",
  async (req: FastifyRequest<{ Body: string }>, rep) => {
    const newProject = prisma.projects.create({ data: JSON.parse(req.body) });
    return newProject;
  }
);

server.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
