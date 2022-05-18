import { Button } from "primereact/button";
import React from "react";
import { useParams } from "react-router-dom";
import { deleteImages } from "../../utils/supabaseUtils";

type Props = {
  name: string;
};

export default function ListItem({ name }: Props) {
  const { project_id } = useParams();
  return (
    <div className="w-full flex p-2">
      <div className="product-list-item w-4rem">
        <img
          loading="lazy"
          className="relative w-full h-full"
          style={{
            objectFit: "contain",
          }}
          src={`https://oqzsfqonlctjkurrmwkj.supabase.co/storage/v1/object/public/images/${project_id}/${name}`}
          alt={name}
        />
      </div>
      <div className="w-10rem ml-2 flex align-items-center ml-4">
        <div className="product-list-detail">
          <div className="text-white Lato">{name}</div>
        </div>
      </div>
      <div className="ml-auto flex align-items-center">
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-outlined text-red-500"
          onClick={() => {
            deleteImages([`${project_id}/${name}`]);
          }}
        />
      </div>
    </div>
  );
}
