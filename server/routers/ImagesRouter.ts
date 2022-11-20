import { FastifyInstance, FastifyRequest } from "fastify";
import { existsSync, mkdirSync, readdir, readdirSync, writeFile } from "fs";

export const imagesRouter = (server: FastifyInstance, _: any, done: any) => {
  server.get("/getallimages/:project_id", async (req: FastifyRequest<{ Params: { project_id: string } }>) => {
    const files = readdirSync(`./assets/images/${req.params.project_id}`);
    return files;
  });
  server.get("/getallmapimages/:project_id", async (req: FastifyRequest<{ Params: { project_id: string } }>) => {
    const files = readdirSync(`./assets/maps/${req.params.project_id}`);
    return files;
  });
  server.get(
    "/getimage/:type/:project_id/:image_name",
    async (
      req: FastifyRequest<{ Params: { type: "images" | "maps"; project_id: string; image_name: string } }>,
      reply,
    ) => {
      const { type, project_id, image_name } = req.params;
      return reply
        .type("image/*")
        .headers({ "Cache-Control": "max-age=86400" })
        .sendFile(`${type}/${project_id}/${image_name}`);
    },
  );

  server.post(
    "/uploadimage/:type/:project_id",
    async (
      req: FastifyRequest<{
        Params: { type: "images" | "maps"; project_id: string };
        Body: any[];
      }>,
    ) => {
      const files = req.body;
      const { type, project_id } = req.params;
      const dir = `./assets/${type}/${project_id}`;
      if (!existsSync(dir)) {
        //check if folder already exists
        mkdirSync(dir); //creating folder
      }
      Object.entries(files).forEach(([key, file]) => {
        writeFile(`./assets/${type}/${project_id}/${key}`, file.data, (err) => {
          if (err) console.log(err);
        });
      });
    },
  );

  done();
};
