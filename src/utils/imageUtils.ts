import { saveAs } from "file-saver";
import JSZip from "jszip";

export async function exportImages(project_id: string, images: string[]) {
  const zip = new JSZip();
  const images_folder = zip.folder("images");
  if (images) {
    for (let index = 0; index < images?.length; index += 1) {
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

export function removeDeletedImages(images: { Key: string }[], variables: { type: "images" | "maps"; image: string }) {
  return images.filter((oldImage) => {
    if (oldImage.Key.includes(variables.type) && oldImage.Key.includes(variables.image)) return false;
    return true;
  });
}

export async function downloadImage(url: string, name: string) {
  if (url) {
    const res = await fetch(url);
    const blob = await res.blob();

    saveAs(blob, name);

    return true;
  }
  return false;
}
