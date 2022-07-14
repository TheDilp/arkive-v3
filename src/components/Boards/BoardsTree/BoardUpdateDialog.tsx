import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Dispatch, SetStateAction } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import {
  BoardItemDisplayDialogProps,
  BoardProps,
  UpdateBoardInputs,
} from "../../../types/BoardTypes";
import { useGetBoards, useUpdateBoard } from "../../../utils/customHooks";
import { BoardUpdateDialogDefault } from "../../../utils/defaultDisplayValues";

type Props = {
  visible: BoardItemDisplayDialogProps;
  setVisible: Dispatch<SetStateAction<BoardItemDisplayDialogProps>>;
};

export default function BoardUpdateDialog({ visible, setVisible }: Props) {
  const { project_id } = useParams();
  const updateBoardMutation = useUpdateBoard(project_id as string);
  const { data: boards } = useGetBoards(project_id as string);

  function recursiveDescendantRemove(
    doc: BoardProps,
    index: number,
    array: BoardProps[],
    selected_id: string
  ): boolean {
    if (doc.parent === null) {
      return true;
    } else {
      const parent = array.find((d) => d.id === doc.parent?.id);
      if (parent) {
        if (parent.id === selected_id) {
          return false;
        } else {
          return recursiveDescendantRemove(parent, index, array, selected_id);
        }
      } else {
        return false;
      }
    }
  }

  return (
    <Dialog
      header={`Update Board ${visible.title}`}
      visible={visible.show}
      modal={false}
      className="w-2"
      onHide={() => setVisible(BoardUpdateDialogDefault)}
    >
      <div>
        <div className="flex flex-wrap justify-content-center row-gap-2">
          <div className="w-full">
            <label className="w-full text-sm text-gray-400">Board Title</label>
            <InputText
              placeholder="Board Title"
              className="w-full"
              value={visible.title}
              onChange={(e) =>
                setVisible((prev) => ({
                  ...prev,
                  title: e.target.value,
                }))
              }
              autoFocus={true}
            />
          </div>

          <div className="w-full">
            <label className="w-full text-sm text-gray-400">Board Folder</label>

            <Dropdown
              className="w-full"
              placeholder="Board Folder"
              optionLabel="title"
              optionValue="id"
              value={visible.parent}
              onChange={(e) =>
                setVisible((prev) => ({
                  ...prev,
                  parent: e.value,
                }))
              }
              options={
                boards
                  ? [
                      { title: "Root", id: null },
                      ...boards.filter((board, idx, array) => {
                        if (!board.folder || board.id === visible.id)
                          return false;
                        return recursiveDescendantRemove(
                          board,
                          idx,
                          array,
                          visible.id
                        );
                      }),
                    ]
                  : []
              }
            />
          </div>
          <div className="w-full flex justify-content-end">
            <Button
              label={`Update ${visible.folder ? "Folder" : "Board"}`}
              className="p-button-success p-button-outlined mt-2"
              icon="pi pi-save"
              iconPos="right"
              type="submit"
            />
          </div>
        </div>
      </div>
    </Dialog>
  );
}
