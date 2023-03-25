import { Button } from "primereact/button";
import { Image } from "primereact/image";
import { Tag } from "primereact/tag";
/* eslint-disable react/destructuring-assignment */

export function ListGridItem(image: string) {
  const imageName = image.split("/").pop();
  const isMap = image.includes("maps");
  return (
    <div className="col-span-1 flex flex-col justify-center px-2">
      <Image alt="Listasset" className="h-full w-full" imageClassName="object-contain" preview src={image} />
    </div>
  );
}
