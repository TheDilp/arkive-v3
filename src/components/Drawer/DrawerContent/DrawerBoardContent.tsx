import { useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useCreateItem, useDeleteItem, useUpdateItem } from "../../../CRUD/ItemsCRUD";
import { useHandleChange } from "../../../hooks/useGetChanged";
import { BoardCreateType, BoardType } from "../../../types/ItemTypes/boardTypes";
import { DrawerAtom } from "../../../utils/Atoms/atoms";
import { boardNodeShapes } from "../../../utils/boardUtils";
import { deleteItem } from "../../../utils/Confirms/Confirm";
import { createUpdateItem } from "../../../utils/CRUD/CRUDFunctions";
import { DefaultBoard } from "../../../utils/DefaultValues/BoardDefaults";
import { DropdownFilter } from "../../../utils/filters";
import { toaster } from "../../../utils/toast";
import { buttonLabelWithIcon } from "../../../utils/transform";
import ColorInput from "../../ColorInput/ColorInput";
import Tags from "../../Tags/Tags";
import { handleCloseDrawer } from "../Drawer";

export default function DrawerBoardContent() {
  const { project_id } = useParams();
  const queryClient = useQueryClient();
  const [drawer, setDrawer] = useAtom(DrawerAtom);
  const createBoardMutation = useCreateItem<BoardType>("boards");
  const updateBoardMutation = useUpdateItem<BoardType>("boards", project_id as string);
  const deleteBoardMutation = useDeleteItem("boards", project_id as string);
  const allBoards = queryClient.getQueryData<BoardType[]>(["allItems", project_id, "boards"]);
  const board = allBoards?.find((b) => b.id === drawer.id);
  const [localItem, setLocalItem] = useState<BoardType | BoardCreateType>(
    board ?? {
      ...DefaultBoard,
      project_id: project_id as string,
    },
  );

  const { handleChange, changedData, resetChanges } = useHandleChange({ data: localItem, setData: setLocalItem });

  useEffect(() => {
    if (board) {
      setLocalItem(board);
    } else {
      setLocalItem({
        ...DefaultBoard,
        project_id: project_id as string,
      });
    }
  }, [board, project_id]);
  return (
    <div className="flex h-full flex-col gap-y-2">
      <h2 className="text-center text-2xl">{board ? `Edit ${board.title}` : "Create New Board"}</h2>
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
          if (e.key === "Enter" && board) {
            updateBoardMutation?.mutate({
              id: board.id,
              ...changedData,
            });
          }
        }}
        placeholder="Board Name"
        value={localItem?.title || ""}
      />
      <div className="">
        <Dropdown
          className="w-full"
          filter
          onChange={(e) => handleChange({ name: "parentId", value: e.target.value })}
          optionLabel="title"
          options={
            allBoards
              ? [{ id: null, title: "Root" }, ...(allBoards as BoardType[]).filter((b) => DropdownFilter(b, board))]
              : [{ id: null, title: "Root" }]
          }
          optionValue="id"
          placeholder="Board Folder"
          value={localItem?.parent?.id}
        />
      </div>
      <Tags handleChange={handleChange} localItem={localItem} type="boards" />
      <h4 className="w-full text-lg underline">Default Node Shape</h4>
      <Dropdown
        className="w-full"
        filter
        onChange={(e) => handleChange({ name: "defaultNodeShape", value: e.value })}
        options={boardNodeShapes}
        placeholder="Default Node Shape"
        value={localItem.defaultNodeShape}
      />
      <div className="flex flex-wrap items-center justify-between">
        <h4 className="w-full text-lg underline">Default Node Color</h4>
        <ColorInput color={localItem.defaultNodeColor as string} name="defaultNodeColor" onChange={handleChange} />
      </div>
      <div className="flex flex-wrap items-center justify-between">
        <h4 className="w-full text-lg underline">Default Edge & Arrow Color</h4>
        <ColorInput color={localItem.defaultEdgeColor as string} name="defaultEdgeColor" onChange={handleChange} />
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
        <span className="p-checkbox-label">Is Public?</span>
        <Checkbox
          checked={localItem.isPublic}
          onChange={(e) =>
            handleChange({
              name: "isPublic",
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
        disabled={createBoardMutation.isLoading || updateBoardMutation.isLoading}
        loading={createBoardMutation.isLoading || updateBoardMutation.isLoading}
        onClick={async () =>
          createUpdateItem<BoardType>(
            board,
            localItem,
            changedData,
            "boards",
            project_id as string,
            queryClient,
            DefaultBoard,
            allBoards,
            resetChanges,
            createBoardMutation.mutateAsync,
            updateBoardMutation.mutateAsync,
            setDrawer,
          )
        }
        type="submit">
        {buttonLabelWithIcon("Save", "mdi:content-save")}
      </Button>
      <div className="mt-auto flex w-full">
        {board ? (
          <Button
            className=" p-button-outlined p-button-danger w-full"
            onClick={() => {
              if (board)
                deleteItem(
                  board.folder
                    ? "Are you sure you want to delete this folder? Deleting it will also delete all of its children!"
                    : "Are you sure you want to delete this board?",
                  () => {
                    deleteBoardMutation?.mutate(board.id);
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
