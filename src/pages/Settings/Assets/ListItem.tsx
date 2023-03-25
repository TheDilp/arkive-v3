import { Button } from "primereact/button";
import { Image } from "primereact/image";
import { Tag } from "primereact/tag";

/* eslint-disable react/destructuring-assignment */
export function ListAssetItem(image: string) {
  const imageName = image.split("/").pop();
  const isMap = image.includes("maps");
  return (
    <div className="flex w-full max-w-full items-center gap-x-4 overflow-x-auto overflow-y-hidden">
      <div className="h-32 w-32">
        <Image alt="Listasset" className="h-32 w-32" imageClassName="object-contain" preview src={image} />
      </div>
      <div className="flex flex-1 items-center justify-between pr-6">
        <div className="flex-1">
          <div className="truncate text-xl font-bold">{imageName}</div>
        </div>
        <div className="flex items-center gap-x-8">
          <Tag severity={isMap ? "warning" : "info"} style={{ fontSize: "1rem" }} value={isMap ? "Map" : "Image"} />
          <Button className="p-button-outlined p-button-danger" icon="pi pi-trash" />
        </div>
      </div>
    </div>
  );
}
