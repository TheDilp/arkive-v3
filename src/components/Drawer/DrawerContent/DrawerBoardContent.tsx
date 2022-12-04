import { useAtom } from "jotai";
import { AutoComplete, AutoCompleteCompleteMethodParams } from "primereact/autocomplete";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useCreateItem, useGetAllMapImages, useUpdateItem } from "../../../CRUD/ItemsCRUD";
import { useGetAllTags } from "../../../CRUD/queries";
import { useGetItem } from "../../../hooks/getItemHook";
import { MapCreateType, MapType } from "../../../types/mapTypes";
import { DrawerAtom } from "../../../utils/Atoms/atoms";
import { DefaultMap } from "../../../utils/DefaultValues/MapDefaults";
import { toaster } from "../../../utils/toast";
import { buttonLabelWithIcon } from "../../../utils/transform";
import { MapImageDropdownItem } from "../../Dropdown/ImageDropdownItem";
import ImageDropdownValue from "../../Dropdown/ImageDropdownValue";

export default function DrawerBoardContent() {
  const { project_id } = useParams();
  const [drawer] = useAtom(DrawerAtom);
  const updateBoardMutation = useUpdateItem("boards");
  const createBoardMutation = useCreateItem("boards");
  // const { data: initialTags } = useGetAllTags(project_id as string, "maps");

  const board = useGetItem(project_id as string, drawer?.id, "boards") as MapType;
  const [localItem, setLocalItem] = useState<MapType | MapCreateType>(
    board ?? {
      ...DefaultMap,
      project_id: project_id as string,
    },
  );

  const [tags, setTags] = useState({ selected: board?.tags || [], suggestions: initialTags });

  const filterTags = (e: AutoCompleteCompleteMethodParams) => {
    const { query } = e;
    if (query && initialTags)
      setTags((prev) => ({
        ...prev,
        suggestions: initialTags.filter((tag) => tag.toLowerCase().includes(query.toLowerCase())),
      }));

    if (!query && initialTags) setTags((prev) => ({ ...prev, suggestions: initialTags }));
  };
  const handleTagsChange = (value: string) => {
    if (board && !board.tags.includes(value)) {
      updateBoardMutation?.mutate({
        id: board.id,
        tags: [...board.tags, value],
      });
    } else if (board.tags.includes(value)) {
      updateBoardMutation?.mutate({
        id: board.id,
        tags: board.tags.filter((tag) => tag !== value),
      });
    }
  };
  function CreateUpdateMap(newData: MapCreateType) {
    if (board) {
      updateBoardMutation?.mutate(
        {
          folder: newData.folder,
          id: board.id,
          title: newData.title,
        },
        {
          onSuccess: () => toaster("success", "Your map was successfully updated."),
        },
      );
    } else {
      if (!localItem.folder && !localItem.map_image) {
        toaster("warning", "Maps must have a map image.");
        return;
      }
      createBoardMutation.mutate({
        ...DefaultMap,
        ...newData,
      });
    }
  }
  useEffect(() => {
    if (board) {
      setLocalItem(board);
    } else {
      setLocalItem({
        ...DefaultMap,
        project_id: project_id as string,
      });
    }
  }, [board, project_id]);

  return (
    <div className="flex flex-col gap-y-2">
      <h2 className="text-center text-2xl">{board ? `Edit ${board.title}` : "Create New Document"}</h2>
      <InputText
        autoFocus
        className="w-full"
        onChange={(e) =>
          setLocalItem((prev) => ({
            ...prev,
            title: e.target.value,
          }))
        }
        onKeyDown={(e) => {
          if (e.key === "Enter" && board) {
            updateBoardMutation?.mutate({
              id: board.id,
              parent: localItem.parent,
              title: localItem.title,
            });
          }
        }}
        value={localItem?.title || ""}
      />

      <Dropdown
        itemTemplate={MapImageDropdownItem}
        onChange={(e) => setLocalItem((prev) => ({ ...prev, map_image: e.value }))}
        options={map_images || []}
        placeholder="Select map"
        value={localItem.map_image}
        valueTemplate={ImageDropdownValue({ map_image: localItem?.map_image })}
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
        value={board?.tags}
      />
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
      <Button
        className="p-button-outlined p-button-success ml-auto"
        onClick={() => {
          CreateUpdateMap(localItem);
        }}
        type="submit">
        {buttonLabelWithIcon("Save", "mdi:content-save")}
      </Button>
    </div>
  );
}
