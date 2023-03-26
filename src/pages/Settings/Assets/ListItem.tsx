import { UseMutateFunction } from "@tanstack/react-query";
import { Button } from "primereact/button";
import { Image } from "primereact/image";
import { Tag } from "primereact/tag";
import { useParams } from "react-router-dom";
import { deleteItem } from "../../../utils/Confirms/Confirm";

/* eslint-disable react/destructuring-assignment */
export function ListAssetItem(
  image: string,
  deleteImage: UseMutateFunction<
    any,
    unknown,
    {
      image: string;
      type: "images" | "maps";
    },
    {}
  >,
) {
  const { project_id } = useParams();
  const imageName = image.split("/").pop();
  const isMap = image.includes("maps");
  return (
    <div className="flex w-full max-w-full items-center gap-x-4 overflow-x-auto overflow-y-hidden">
      <div className="h-32 w-32">
        <Image downloadable alt="Listasset" className="h-32 w-32" imageClassName="object-contain" preview src={image} />
      </div>
      <div className="flex flex-1 items-center justify-between pr-6">
        <div className="flex-1">
          <div className="truncate text-xl font-bold">{imageName}</div>
        </div>
        <div className="flex items-center gap-x-8">
          <Tag severity={isMap ? "warning" : "info"} style={{ fontSize: "1rem" }} value={isMap ? "Map" : "Image"} />
          <Button
            className="p-button-outlined p-button-danger"
            icon="pi pi-trash"
            onClick={() =>
              deleteItem("Are you sure you want to delete this image?", () => {
                if (imageName) deleteImage({ image: imageName, type: isMap ? "maps" : "images" });
              })
            }
          />
        </div>
      </div>
    </div>
  );
}
