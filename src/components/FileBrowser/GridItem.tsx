import React from "react";
import { useParams } from "react-router-dom";

type Props = {
  name: string;
};

export default function GridItem({ name }: Props) {
  const { project_id } = useParams();
  return (
    <div className="w-full">
      <div className="flex flex-wrap justify-content-center align-items-bottom">
        <div className="w-full flex justify-content-center pt-2">
          <img
            loading="lazy"
            className="w-6"
            src={`https://oqzsfqonlctjkurrmwkj.supabase.co/storage/v1/object/public/images/${project_id}/${name}`}
            alt="TEST"
          />
        </div>
        <div className="text-center text-2xl mb-2 text-white Lato">{name}</div>
      </div>
    </div>
  );
}
