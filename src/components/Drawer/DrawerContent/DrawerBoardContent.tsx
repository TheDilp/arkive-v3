import { useAtom } from "jotai";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { ColorPicker } from "primereact/colorpicker";
import { InputText } from "primereact/inputtext";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useCreateItem, useDeleteItem, useGetAllItems, useUpdateItem } from "../../../CRUD/ItemsCRUD";
import { useHandleChange } from "../../../hooks/useGetChanged";
import { useGetItem } from "../../../hooks/useGetItem";
import { BoardCreateType, BoardType } from "../../../types/boardTypes";
import { DrawerAtom } from "../../../utils/Atoms/atoms";
import { deleteItem } from "../../../utils/Confirms/Confirm";
import { DefaultBoard } from "../../../utils/DefaultValues/BoardDefaults";
import { DefaultMap } from "../../../utils/DefaultValues/MapDefaults";
import { toaster } from "../../../utils/toast";
import { buttonLabelWithIcon } from "../../../utils/transform";
import Tags from "../../Tags/Tags";
import { handleCloseDrawer } from "../Drawer";

export default function DrawerBoardContent() {
  const { project_id } = useParams();
  const [drawer, setDrawer] = useAtom(DrawerAtom);
  const createBoardMutation = useCreateItem("boards");
  const updateBoardMutation = useUpdateItem("boards");
  const deleteBoardMutation = useDeleteItem("boards", project_id as string);
  const { data: boards } = useGetAllItems(project_id as string, "boards");
  const { data: currentBoard } = useGetItem(drawer?.id as string, "boards", { enabled: !!drawer?.id }) as { data: BoardType };

  const [localItem, setLocalItem] = useState<BoardType | BoardCreateType>(
    currentBoard ?? {
      ...DefaultMap,
      project_id: project_id as string,
    },
  );

  const { handleChange, changedData, resetChanges } = useHandleChange({ data: localItem, setData: setLocalItem });

  function CreateUpdateBoard(newData: BoardCreateType) {
    if (currentBoard) {
      if (boards?.some((item) => item.parent === newData.id) && !newData.folder) {
        toaster("warning", "Cannot convert to board if folder contains files.");
        return;
      }
      updateBoardMutation?.mutate(
        {
          id: currentBoard.id,
          ...changedData,
        },
        {
          onSuccess: () => {
            toaster("success", "Your board was successfully updated.");
            resetChanges();
          },
        },
      );
    } else {
      createBoardMutation.mutate({
        ...DefaultBoard,
        ...newData,
      });
    }
  }
  useEffect(() => {
    if (currentBoard) {
      setLocalItem(currentBoard);
    } else {
      setLocalItem({
        ...DefaultBoard,
        project_id: project_id as string,
      });
    }
  }, [currentBoard, project_id]);

  return (
    <div className="flex h-full flex-col gap-y-2">
      <h2 className="text-center text-2xl">{currentBoard ? `Edit ${currentBoard.title}` : "Create New Board"}</h2>
      <InputText
        autoFocus
        className="w-full"
        onChange={(e) =>
          handleChange({
            name: "title",
            value: e.target.value,
          })
        }
        onKeyDown={(e) => {
          if (e.key === "Enter" && currentBoard) {
            updateBoardMutation?.mutate({
              id: currentBoard.id,
              parent: localItem.parent,
              title: localItem.title,
            });
          }
        }}
        placeholder="Board Name"
        value={localItem?.title || ""}
      />

      <Tags handleChange={handleChange} localItem={localItem} type="boards" />
      <div className="flex flex-wrap items-center justify-between">
        <h4 className="w-full text-lg underline">Default Node Color</h4>

        <ColorPicker
          onChange={(e) =>
            handleChange({
              name: "defaultNodeColor",
              value: `#${e.target.value}`,
            })
          }
          value={localItem.defaultNodeColor}
        />
        <InputText
          onChange={(e) =>
            handleChange({
              name: "defaultNodeColor",
              value: e.target.value,
            })
          }
          value={localItem.defaultNodeColor || ""}
        />
      </div>
      <div className="flex flex-wrap items-center justify-between">
        <h4 className="w-full text-lg underline">Default Edge & Arrow Color</h4>

        <ColorPicker
          onChange={(e) =>
            handleChange({
              name: "defaultEdgeColor",
              value: `#${e.target.value}`,
            })
          }
          value={localItem.defaultEdgeColor}
        />
        <InputText
          onChange={(e) =>
            handleChange({
              name: "defaultNodeColor",
              value: e.target.value,
            })
          }
          value={localItem.defaultEdgeColor || ""}
        />
      </div>
      <div className="flex items-center justify-between">
        <span className="p-checkbox-label">Is Folder?</span>
        <Checkbox
          checked={localItem.folder}
          onChange={(e) =>
            handleChange({
              name: "folder",
              value: e.checked,
            })
          }
        />
      </div>
      <div className="flex items-center justify-between">
        <span className="p-checkbox-label">Draw grid by default?</span>
        <Checkbox
          checked={localItem.defaultGrid}
          onChange={(e) =>
            handleChange({
              name: "defaultGrid",
              value: e.checked,
            })
          }
        />
      </div>

      <Button
        className="p-button-outlined p-button-success ml-auto"
        onClick={() => {
          CreateUpdateBoard(localItem);
        }}
        type="submit">
        {buttonLabelWithIcon("Save", "mdi:content-save")}
      </Button>
      <div className="mt-auto flex w-full">
        {document ? (
          <Button
            className=" p-button-outlined p-button-danger w-full"
            onClick={() => {
              if (document)
                deleteItem(
                  currentBoard.folder
                    ? "Are you sure you want to delete this folder? Deleting it will also delete all of its children!"
                    : "Are you sure you want to delete this board?",
                  () => {
                    deleteBoardMutation?.mutate(currentBoard.id);
                    handleCloseDrawer(setDrawer, "right");
                  },
                  () => toaster("info", "Item not deleted."),
                );
            }}
            type="submit">
            {buttonLabelWithIcon("Delete", "mdi:trash")}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
