import React from "react";
import { useParams } from "react-router-dom";

type Props = {
  name: string;
};

export default function ListItem({ name }: Props) {
  const { project_id } = useParams();
  return (
    <div className="col-12 flex p-2">
      <div className="product-list-item w-4rem">
        <img
          loading="lazy"
          className="relative w-full h-full"
          style={{
            objectFit: "contain",
          }}
          src={`https://oqzsfqonlctjkurrmwkj.supabase.co/storage/v1/object/public/images/${project_id}/${name}`}
          alt="TEST"
        />
      </div>
      <div className="w-10rem ml-2 flex align-items-center ml-4">
        <div className="product-list-detail">
          <div className="text-white Lato">{name}</div>
        </div>
      </div>
    </div>
  );
}
