import { UseMutateFunction } from "@tanstack/react-query";
import { Button } from "primereact/button";
import { Image } from "primereact/image";
import { OverlayPanel } from "primereact/overlaypanel";
import { Tag } from "primereact/tag";
import { useRef } from "react";

import { deleteItem } from "../../../utils/Confirms/Confirm";
import { downloadImage } from "../../../utils/imageUtils";
import { useAtomValue } from "jotai";
import { UserAtom } from "../../../utils/Atoms/atoms";
import { FetchFunction } from "../../../utils/CRUD/CRUDFetch";
import { baseURLS } from "../../../types/CRUDenums";
import { useParams } from "react-router-dom";

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
  const UserData = useAtomValue(UserAtom);
  const imageName = image.split("/").pop();
  const isMap = image.includes("maps");
  const op = useRef() as any;
  return (
    <div className="flex w-full max-w-full items-center gap-x-4 overflow-x-auto overflow-y-hidden">
      <div className="h-32 w-32">
        <Image alt="Listasset" className="h-32 w-32" downloadable imageClassName="object-contain" preview src={image} />
      </div>
      <div className="flex flex-1 items-center justify-between pr-6">
        <div className="flex-1">
          <div className="truncate text-xl font-bold">{imageName}</div>
        </div>
        <div className="flex items-center gap-x-4">
          <Tag severity={isMap ? "warning" : "info"} style={{ fontSize: "1rem" }} value={isMap ? "Map" : "Image"} />
          <Button
            className="p-button-outlined p-button-success"
            icon="pi pi-download"
            onClick={() => {
              if (imageName) downloadImage(image, imageName);
            }}
          />
          <Button
            className="p-button-outlined p-button-info"
            icon="pi pi-share-alt"
            onClick={(e) => {
              op.current.toggle(e);
            }}
          />
          <OverlayPanel ref={op} style={{ width: "fit-content" }}>
            {UserData?.webhooks?.map((hook, idx) => (
              <Button
                key={hook.id}
                className="p-button-outlined p-button-secondary min-w-fit"
                onClick={async () =>
                  FetchFunction({
                    url: `${baseURLS.baseServer}sendpublicitem`,
                    method: "POST",
                    body: JSON.stringify({
                      id: "",
                      item_type: "images",
                      project_id,
                      webhook_url: hook.url,
                      image,
                    }),
                  })
                }>
                {hook?.title || `Server ${idx + 1}`}
              </Button>
            ))}
          </OverlayPanel>
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
