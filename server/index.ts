import cors from "@fastify/cors";
import { PrismaClient } from "@prisma/client";
import fastify from "fastify";
import fileupload from "fastify-file-upload";
import fastifystatic from "@fastify/static";
import { documentRouter } from "./routers/DocumentRouter";
import { getRouter } from "./routers/GetRouter";
import { imagesRouter } from "./routers/ImagesRouter";
import { mapRouter } from "./routers/MapRouter";
import { projectRouter } from "./routers/ProjectRouter";
import path from "path";

export const prisma = new PrismaClient();

const server = fastify();
server.register(fastifystatic, {
  root: path.join(__dirname, "assets"),
});

server.register(fileupload);

server.register(cors, {
  origin: true,
});
server.register(projectRouter);
server.register(getRouter);
server.register(documentRouter);
server.register(mapRouter);
server.register(imagesRouter);

if (process.env.VITE_BE_PORT) 
server.listen({ port: parseInt(process.env.VITE_BE_PORT) as number }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
