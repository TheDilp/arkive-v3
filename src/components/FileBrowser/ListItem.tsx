import { Button } from "primereact/button";
import { useParams } from "react-router-dom";
import { useDeleteImages } from "../../utils/customHooks";
import { supabaseStorageLink } from "../../utils/utils";

type Props = {
  name: string;
};

export default function ListItem({ name }: Props) {
  const { project_id } = useParams();
  const deleteImageMutation = useDeleteImages(project_id as string);

  return (
    <div className="w-full flex p-2">
      <div className="product-list-item w-4rem">
        <img
          loading="lazy"
          className="relative w-full h-full"
          style={{
            objectFit: "contain",
          }}
          src={`${supabaseStorageLink}${project_id}/${name}`}
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
            deleteImageMutation.mutate([`${project_id as string}/${name}`]);
          }}
        />
      </div>
    </div>
  );
}
