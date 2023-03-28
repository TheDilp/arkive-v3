import { Icon } from "@iconify/react";
import { useAtom } from "jotai";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useState } from "react";
import { useParams } from "react-router-dom";

import { Tooltip } from "../../components/Tooltip/Tooltip";
import { useDeleteSubItem } from "../../CRUD/ItemsCRUD";
import { useGetItem } from "../../hooks/useGetItem";
import { RandomTableOptionType, RandomTableType } from "../../types/ItemTypes/randomTableTypes";
import { DrawerAtom } from "../../utils/Atoms/atoms";
import { deleteItem } from "../../utils/Confirms/Confirm";
import { DefaultDrawer } from "../../utils/DefaultValues/DrawerDialogDefaults";
import { getRandomTableResult } from "../../utils/randomtableUtils";
import { toaster } from "../../utils/toast";
import { buttonLabelWithIcon } from "../../utils/transform";

function IconColumn({ icon, iconColor }: RandomTableOptionType) {
  if (icon)
    return (
      <div className="flex justify-center">
        <Icon color={iconColor || "#ffffff"} fontSize={32} icon={icon} />
      </div>
    );
  return null;
}

function ActionsColumn(
  { id, title, description, icon, iconColor }: RandomTableOptionType,
  deleteAction: (docId: string) => void,
  editAction: (data: Pick<RandomTableOptionType, "id" | "title" | "description" | "icon" | "iconColor">) => void,
) {
  return (
    <div className="flex justify-center gap-x-1">
      <Button
        className="p-button-success p-button-outlined"
        icon="pi pi-fw pi-pencil"
        onClick={() => {
          editAction({ id, title, description, icon, iconColor });
        }}
        tooltip="Edit"
        tooltipOptions={{ showDelay: 300, position: "left" }}
      />
      <Button
        className="p-button-info p-button-outlined"
        icon="pi pi-fw pi-copy"
        onClick={() => {
          navigator.clipboard.writeText(`${title}${description ? `: ${description}` : null}`);
          toaster("success", "Item successfully copied.📎");
        }}
        tooltip="Copy"
        tooltipOptions={{ showDelay: 300, position: "left" }}
      />
      <Button
        className="p-button-danger p-button-outlined"
        icon="pi pi-fw pi-trash"
        iconPos="right"
        onClick={() => deleteAction(id)}
      />
    </div>
  );
}

export default function RandomTableView() {
  const { item_id } = useParams();
  const [result, setResult] = useState<null | { index: number; title: string; description?: string }>(null);
  const { data: randomTable, isLoading } = useGetItem<RandomTableType>(item_id as string, "randomtables");

  const [, setDrawer] = useAtom(DrawerAtom);
  const { mutate: deleteMutation } = useDeleteSubItem(item_id as string, "randomtableoptions", "randomtables");
  const deleteAction = (id: string) => deleteItem("Are you sure you want to delete this item?", () => deleteMutation(id));
  const editAction = (data: { id: string; title: string; description: string }) =>
    setDrawer({
      ...DefaultDrawer,
      data,
      show: true,
      type: "randomtableoptions",
    });

  return (
    <div className="flex w-full flex-col p-4">
      <div className="flex w-full items-center gap-y-2 gap-x-2 pb-2">
        <Button
          className="p-button-outlined w-fit"
          icon="pi pi-plus"
          iconPos="right"
          label="Add option"
          onClick={() => {
            setDrawer({
              ...DefaultDrawer,
              show: true,
              type: "randomtableoptions",
            });
          }}
        />
        <Button
          className="p-button-outlined p-button-success w-fit"
          disabled={randomTable?.random_table_options?.length === 0}
          onClick={() => {
            if (randomTable) setResult(getRandomTableResult(randomTable));
          }}>
          {buttonLabelWithIcon("Roll on table", "arcticons:reroll")}
        </Button>
        {result ? (
          <div className="flex flex-1 items-center justify-between truncate">
            <Tooltip
              content={
                <div className="w-48 break-words rounded bg-black p-2 text-white">{`${result.index + 1}. ${result?.title} ${
                  result?.description ? `: ${result.description}` : null
                }`}</div>
              }>
              <span className="truncate">
                <span className="font-bold">{`${result.index + 1}. ${result?.title}`}</span>
                <span>{result?.description ? `: ${result.description}` : null}</span>
              </span>
            </Tooltip>
            <Button
              className="p-button-text"
              icon="pi pi-copy"
              onClick={async () => {
                await navigator.clipboard.writeText(`${result.title}: ${result?.description ? result.description : ""}`);
                toaster("success", "Copied to clipboard. 📎");
              }}
              tooltip="Copy to clipboard"
              tooltipOptions={{ position: "left" }}
            />
          </div>
        ) : null}
      </div>
      <DataTable
        loading={isLoading}
        paginator
        rows={100}
        scrollable
        scrollHeight="80vh"
        size="small"
        value={randomTable?.random_table_options || []}>
        <Column
          body={(_, info) => {
            return `${info.rowIndex + 1}.`;
          }}
        />
        <Column bodyClassName="font-medium w-[30%]" field="title" header="Title" />
        <Column bodyClassName="font-light italic w-[60%]" field="description" header="Description" />
        <Column align="center" body={IconColumn} bodyClassName="w-[5%]" field="icon" header="Icon" />
        <Column
          align="center"
          body={(data) => ActionsColumn(data, deleteAction, editAction)}
          bodyClassName="font-medium w-[5%]"
          header="Actions"
        />
      </DataTable>
    </div>
  );
}
