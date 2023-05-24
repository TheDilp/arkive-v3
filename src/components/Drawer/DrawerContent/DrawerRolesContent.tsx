import { useAtom } from "jotai";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { useState } from "react";
import { useParams } from "react-router-dom";

import { useGetProjectRoles } from "../../../CRUD/ProjectCRUD";
import { RolePermissionsType } from "../../../types/generalTypes";
import { RoleCreateType, RoleType } from "../../../types/ItemTypes/projectTypes";
import { DrawerAtom } from "../../../utils/Atoms/atoms";
import { deleteItem } from "../../../utils/Confirms/Confirm";
import { IconEnum } from "../../../utils/DefaultValues/GeneralDefaults";
import { toaster } from "../../../utils/toast";
import { buttonLabelWithIcon } from "../../../utils/transform";
import { handleCloseDrawer } from "../Drawer";
import DrawerSection from "../DrawerSection";

function getPermissionValue(localItem: RoleType | RoleCreateType, name: string) {
  if (localItem[`edit_${name}` as RolePermissionsType]) return `edit_${name}`;
  if (localItem[`view_${name}` as RolePermissionsType]) return `view_${name}`;

  return "none";
}

const RoleItems = [
  "Documents",
  "Maps",
  "Boards",
  "Calendars",
  "Timelines",
  "Screens",
  "Dictionaries",
  "Random_tables",
  "Tags",
  "Alter_names",
];
export default function DrawerRolesContent() {
  const { project_id } = useParams();
  const [drawer, setDrawer] = useAtom(DrawerAtom);
  const { data: roles } = useGetProjectRoles(project_id as string);
  const role = roles?.find((r) => r.id === drawer.id);
  const [localItem, setLocalItem] = useState<RoleType | RoleCreateType>(
    role ?? {
      title: "New role",
      project_id: project_id as string,
    },
  );

  return (
    <div className="flex h-full flex-col">
      <h2 className="text-center font-Lato text-2xl">{role ? `Edit ${role.title}` : "Create new Role"}</h2>
      <DrawerSection title="Permissions">
        <div className="flex flex-col gap-y-4">
          {RoleItems.map((item) => (
            <div key={item} className="flex items-center justify-between">
              <h4>{item.replaceAll("_", " ")}:</h4>
              <Dropdown
                onChange={(e) => {
                  const newLocalItem = {
                    ...localItem,
                  };
                  if (e.value === "none") {
                    newLocalItem[`view_${item.toLowerCase()}` as RolePermissionsType] = false;
                    newLocalItem[`edit_${item.toLowerCase()}` as RolePermissionsType] = false;
                  }
                  if (e.value === `view_${item.toLowerCase()}`) {
                    newLocalItem[`view_${item.toLowerCase()}` as RolePermissionsType] = true;
                    newLocalItem[`edit_${item.toLowerCase()}` as RolePermissionsType] = false;
                  }
                  if (e.value === `edit_${item.toLowerCase()}`) {
                    newLocalItem[`view_${item.toLowerCase()}` as RolePermissionsType] = false;
                    newLocalItem[`edit_${item.toLowerCase()}` as RolePermissionsType] = true;
                  }
                  setLocalItem(newLocalItem);
                }}
                options={[
                  { label: "None", value: "none" },
                  { label: "View", value: `view_${item.toLowerCase()}` },
                  ...(item !== "Tags" && item !== "Alter_names"
                    ? [{ label: "Edit", value: `edit_${item.toLowerCase()}` }]
                    : []),
                ]}
                value={getPermissionValue(localItem, item.toLowerCase())}
              />
            </div>
          ))}
        </div>
      </DrawerSection>
      <div className="mt-auto flex w-full flex-col gap-y-2">
        <Button
          className="p-button-outlined p-button-success ml-auto h-10 min-h-[2.5rem]"
          // disabled={createBoardMutation.isLoading || updateBoardMutation.isLoading}
          // loading={createBoardMutation.isLoading || updateBoardMutation.isLoading}
          onClick={async () => {}}
          type="submit">
          {buttonLabelWithIcon("Save", IconEnum.save)}
        </Button>
        {role ? (
          <Button
            className=" p-button-outlined p-button-danger w-full"
            onClick={() => {
              if (role)
                deleteItem(
                  "Are you sure you want to delete this role? All users with this role will lose permissions associated with this role.",
                  () => {
                    // deleteBoardMutation?.mutate(board.id);
                    handleCloseDrawer(setDrawer, "right");
                  },
                  () => toaster("info", "Item not deleted."),
                );
            }}
            type="submit">
            {buttonLabelWithIcon("Delete", IconEnum.trash)}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
