import { Button } from "primereact/button";
import { Image } from "primereact/image";
import { Tag } from "primereact/tag";
/* eslint-disable react/destructuring-assignment */

export function ListGridItem(image: string) {
  const imageName = image.split("/").pop();
  const isMap = image.includes("maps");
  return (
    <div className="col-span-2 flex flex-col justify-center">
      <div className="flex items-center gap-x-4">
        <div className="truncate text-xl font-bold">{imageName}</div>
        <div className="flex items-center gap-x-2">
          <Tag severity={isMap ? "warning" : "info"} style={{ fontSize: "1rem" }} value={isMap ? "Map" : "Image"} />
          <Button className="p-button-outlined p-button-danger" icon="pi pi-trash" />
        </div>
      </div>

      <Image alt="Listasset" className="h-full w-full" imageClassName="object-contain" preview src={image} />
    </div>
  );
}
