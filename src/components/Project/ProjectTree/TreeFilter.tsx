import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import React from "react";
import { useParams } from "react-router-dom";
import { useCreateDocument } from "../../../utils/customHooks";
import { auth } from "../../../utils/supabaseUtils";

type Props = {
  filter: string;
  setFilter: (filter: string) => void;
};

export default function TreeFilter({ filter, setFilter }: Props) {
  const { project_id } = useParams();
  const user = auth.user();

  const createDocument = useCreateDocument(
    project_id as string,
    user?.id as string
  );
  return (
    <div className="pt-2 px-2 w-full">
      <div className="w-full py-1">
        <Button
          label="New Document"
          icon={"pi pi-fw pi-plus"}
          iconPos="right"
          className="p-button-outlined Lato"
          onClick={() => createDocument.mutate()}
        />
      </div>
      <InputText
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="w-full p-1"
        placeholder="Filter Documents"
      />
    </div>
  );
}
