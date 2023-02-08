import { useAtom } from "jotai";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useState } from "react";
import { useParams } from "react-router-dom";

import { Tooltip } from "../../components/Tooltip/Tooltip";
import { useGetItem } from "../../hooks/useGetItem";
import { RandomTableType } from "../../types/ItemTypes/randomTableTypes";
import { DrawerAtom } from "../../utils/Atoms/atoms";
import { DefaultDrawer } from "../../utils/DefaultValues/DrawerDialogDefaults";
import { getRandomTableResult } from "../../utils/randomtableUtils";
import { toaster } from "../../utils/toast";
import { buttonLabelWithIcon } from "../../utils/transform";

export default function RandomTableView() {
  const { item_id } = useParams();
  const [result, setResult] = useState<null | { index: number; title: string; description?: string }>(null);
  const { data: randomTable, isLoading } = useGetItem<RandomTableType>(item_id as string, "randomtables");

  const [, setDrawer] = useAtom(DrawerAtom);

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
        responsiveLayout="scroll"
        rows={100}
        size="small"
        value={randomTable?.random_table_options || []}>
        <Column
          body={(_, info) => {
            return `${info.rowIndex + 1}.`;
          }}
        />
        <Column bodyClassName="italic font-light w-[30%]" field="title" />
        <Column bodyClassName="font-medium w-[70%]" field="description" />
      </DataTable>
    </div>
  );
}
