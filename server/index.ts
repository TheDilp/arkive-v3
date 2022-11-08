import cors from "@fastify/cors";
import { PrismaClient } from "@prisma/client";
import fastify from "fastify";
import { documentRouter } from "./routers/DocumentRouter";
import { projectRouter } from "./routers/ProjectRouter";

export const prisma = new PrismaClient();

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
server.register(projectRouter);
server.register(documentRouter);

server.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
