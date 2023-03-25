import { saveAs } from "file-saver";
import JSZip from "jszip";

export async function exportImages(project_id: string, images: string[]) {
  const zip = new JSZip();
  let images_folder = zip.folder("images");
  if (images) {
    for (let index = 0; index < images?.length; index++) {
      if (images?.[index]) {
        const res = await fetch(images[index]);
        const blob = await res.blob();

        images_folder?.file(images[index].replace(`${import.meta.env.VITE_S3_CDN_HOST}/assets/`, ""), blob, {
          base64: true,
        });
      }
    }
    zip
      ?.generateAsync({
        type: "blob",
        compression: "DEFLATE",
        compressionOptions: {
          level: 5,
        },
      })
      .then((content) => {
        saveAs(content, `${project_id}-images.zip`);
      });
  }
}
