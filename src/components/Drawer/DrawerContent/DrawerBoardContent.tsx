import { useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { AutoComplete, AutoCompleteCompleteMethodParams } from "primereact/autocomplete";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { ColorPicker } from "primereact/colorpicker";
import { InputText } from "primereact/inputtext";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useCreateItem, useGetAllItems, useUpdateItem } from "../../../CRUD/ItemsCRUD";
import { useGetAllTags } from "../../../CRUD/OtherCRUD";
import { useGetItem } from "../../../hooks/useGetItem";
import { BoardCreateType, BoardType } from "../../../types/boardTypes";
import { DrawerAtom } from "../../../utils/Atoms/atoms";
import { DefaultBoard } from "../../../utils/DefaultValues/BoardDefaults";
import { DefaultMap } from "../../../utils/DefaultValues/MapDefaults";
import { toaster } from "../../../utils/toast";
import { buttonLabelWithIcon } from "../../../utils/transform";

export default function DrawerBoardContent() {
  const { project_id } = useParams();
  const queryClient = useQueryClient();
  const [drawer] = useAtom(DrawerAtom);
  const updateBoardMutation = useUpdateItem("boards");
  const createBoardMutation = useCreateItem("boards");
  const { data: initialTags } = useGetAllTags(project_id as string, "boards");
  const { data: boards } = useGetAllItems(project_id as string, "boards");
  const { data: currentBoard } = useGetItem(drawer?.id as string, "boards", { enabled: !!drawer?.id }) as { data: BoardType };
  const [localItem, setLocalItem] = useState<BoardType | BoardCreateType>(
    currentBoard ?? {
      ...DefaultMap,
      project_id: project_id as string,
    },
  );
  const [tags, setTags] = useState({ selected: currentBoard?.tags || [], suggestions: initialTags });

  const filterTags = (e: AutoCompleteCompleteMethodParams) => {
    const { query } = e;
    if (query && initialTags)
      setTags((prev) => ({
        ...prev,
        suggestions: initialTags.filter((tag) => tag.toLowerCase().includes(query.toLowerCase())),
      }));

    if (!query && initialTags) setTags((prev) => ({ ...prev, suggestions: initialTags }));
  };
  const handleTagsChange = async (value: string) => {
    if (!currentBoard && !localItem?.tags?.includes(value)) {
      setLocalItem((prev) => ({ ...prev, tags: [...(localItem?.tags || []), value] }));
    } else if (!currentBoard && localItem?.tags?.includes(value)) {
      setLocalItem((prev) => ({ ...prev, tags: (localItem?.tags || []).filter((tag) => tag !== value) }));
    }
    if (currentBoard && !currentBoard?.tags?.includes(value)) {
      await updateBoardMutation?.mutateAsync({
        id: currentBoard.id,
        tags: [...currentBoard.tags, value],
      });
    } else if (currentBoard && currentBoard?.tags?.includes(value)) {
      await updateBoardMutation?.mutateAsync({
        id: currentBoard.id,
        tags: currentBoard.tags.filter((tag) => tag !== value),
      });
    }
    queryClient.refetchQueries({ queryKey: ["allTags", project_id, "boards"] });
  };
  function CreateUpdateBoard(newData: BoardCreateType) {
    if (currentBoard) {
      if (boards?.some((item) => item.parent === newData.id) && !newData.folder) {
        toaster("warning", "Cannot convert to board if folder contains files.");
        return;
      }
      updateBoardMutation?.mutate(
        {
          folder: newData.folder,
          id: currentBoard.id,
          title: newData.title,
          defaultNodeColor: newData.defaultNodeColor,
          defaultEdgeColor: newData.defaultEdgeColor,
          defaultGrid: newData.defaultGrid,
        },
        {
          onSuccess: () => toaster("success", "Your board was successfully updated."),
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
    <div className="flex flex-col gap-y-2">
      <h2 className="text-center text-2xl">{currentBoard ? `Edit ${currentBoard.title}` : "Create New Board"}</h2>
      <InputText
        autoFocus
        placeholder="Board Name"
        className="w-full"
        onChange={(e) =>
          setLocalItem((prev) => ({
            ...prev,
            title: e.target.value,
          }))
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
        value={localItem?.title || ""}
      />

      <AutoComplete
        className="mapTagsAutocomplete max-h-40 w-full border-zinc-600"
        completeMethod={filterTags}
        multiple
        onChange={(e) => setTags((prev) => ({ ...prev, selected: e.value }))}
        onKeyPress={async (e) => {
          // For adding completely new tags
          if (e.key === "Enter" && e.currentTarget.value !== "") {
            handleTagsChange(e.currentTarget.value);
            e.currentTarget.value = "";
          }
        }}
        onSelect={(e) => handleTagsChange(e.value)}
        onUnselect={(e) => handleTagsChange(e.value)}
        placeholder="Add Tags"
        suggestions={tags.suggestions}
        value={localItem?.tags}
      />
      <div className="flex flex-wrap items-center justify-between">
        <h4 className="w-full text-lg underline">Default Node Color</h4>

        <ColorPicker
          onChange={(e) => setLocalItem((prev) => ({ ...prev, defaultNodeColor: `#${e.value}` as string }))}
          value={localItem.defaultNodeColor}
        />
        <InputText
          onChange={(e) => setLocalItem((prev) => ({ ...prev, defaultNodeColor: e.target.value }))}
          value={localItem.defaultNodeColor || ""}
        />
      </div>
      <div className="flex flex-wrap items-center justify-between">
        <h4 className="w-full text-lg underline">Default Edge & Arrow Color</h4>

        <ColorPicker
          onChange={(e) => setLocalItem((prev) => ({ ...prev, defaultEdgeColor: `#${e.value}` as string }))}
          value={localItem.defaultEdgeColor}
        />
        <InputText
          onChange={(e) => setLocalItem((prev) => ({ ...prev, defaultEdgeColor: e.target.value }))}
          value={localItem.defaultEdgeColor || ""}
        />
      </div>
      <div className="flex items-center justify-between">
        <span className="p-checkbox-label">Is Folder?</span>
        <Checkbox
          checked={localItem.folder}
          onChange={(e) =>
            setLocalItem((prev) => ({
              ...prev,
              folder: e.checked,
            }))
          }
        />
      </div>
      <div className="flex items-center justify-between">
        <span className="p-checkbox-label">Draw grid by default?</span>
        <Checkbox
          checked={localItem.defaultGrid}
          onChange={(e) =>
            setLocalItem((prev) => ({
              ...prev,
              defaultGrid: e.checked,
            }))
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
    </div>
  );
}
