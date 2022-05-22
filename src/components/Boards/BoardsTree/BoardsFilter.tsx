import { Button } from "primereact/button";
import { v4 as uuid } from "uuid";
import { useParams } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Icon } from "@iconify/react";
import { useCreateBoard } from "../../../utils/customHooks";

type Props = {
  filter: string;
  setFilter: (filter: string) => void;
};

export default function BoardsFilter({ filter, setFilter }: Props) {
  const { project_id } = useParams();
  const createBoardMutation = useCreateBoard();

  function createNewBoard(type: string) {
    let id = uuid();
    if (type === "folder") {
      createBoardMutation.mutate({
        id,
        project_id: project_id as string,
        title: "New Folder",
        folder: true,
        layout: "Preset",
      });
    } else {
      createBoardMutation.mutate({
        id,
        project_id: project_id as string,
        title: "New Board",
        folder: false,
        layout: "Preset",
      });
    }
  }
  return (
    <div className="w-full py-1 flex justify-content-between flex-wrap">
      <div className="w-full py-2">
        <InputText
          className="w-full"
          placeholder="Search Boards"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>
      <Button
        label="New Folder"
        icon="pi pi-fw pi-folder"
        iconPos="right"
        className="p-button-outlined"
        onClick={() => createNewBoard("folder")}
      />
      <Button
        label="New Board"
        icon={() => (
          <span className="p-button-icon p-c p-button-icon-right pi pi-fw">
            <Icon icon={"mdi:draw"} style={{ float: "right" }} fontSize={18} />
          </span>
        )}
        className="p-button-outlined"
        onClick={() => createNewBoard("board")}
      />
    </div>
  );
}
