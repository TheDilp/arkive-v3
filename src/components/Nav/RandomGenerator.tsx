import { useQueryClient } from "@tanstack/react-query";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { useState } from "react";
import { useParams } from "react-router-dom";

import { useGetAllItems } from "../../CRUD/ItemsCRUD";
import { baseURLS } from "../../types/CRUDenums";
import { RandomTableType } from "../../types/ItemTypes/randomTableTypes";
import { FetchFunction } from "../../utils/CRUD/CRUDFetch";
import { getRandomTableResult } from "../../utils/randomtableUtils";
import { buttonLabelWithIcon } from "../../utils/transform";
import LoadingScreen from "../Loading/LoadingScreen";

export default function RandomGenerator() {
  const queryClient = useQueryClient();
  const { project_id } = useParams();
  const [loadingTableOptions, setLoadingTableOptions] = useState(false);
  const { data: allRandomTables, isFetching } = useGetAllItems<RandomTableType>(project_id as string, "randomtables", {
    staleTime: 5 * 60 * 1000,
  });
  const [selectedRandomTable, setSelectedRandomTable] = useState<RandomTableType | null>(null);
  const [result, setResult] = useState<{ index: number; title: string; description?: string } | null>(null);

  return (
    <div className="relative max-h-80 min-h-[20rem] w-80 max-w-[20rem] rounded bg-zinc-800 p-2">
      {isFetching ? (
        <LoadingScreen />
      ) : (
        <div className="flex flex-col gap-y-2">
          <Dropdown
            className="w-full"
            filter
            onChange={(e) => setSelectedRandomTable(e.value)}
            optionLabel="title"
            options={allRandomTables}
            panelClassName="randomTableNavbarDropdownPanel"
            placeholder="Select a table to roll on"
            value={selectedRandomTable}
          />
          <Button
            className="p-button-outlined p-button-success w-full"
            disabled={!selectedRandomTable || loadingTableOptions}
            loading={loadingTableOptions}
            onClick={async () => {
              if (selectedRandomTable) {
                const currentData = queryClient.getQueryData<RandomTableType>(["randomtables", selectedRandomTable.id, false]);
                if (!currentData) setLoadingTableOptions(true);
                const tableData = await queryClient.ensureQueryData<RandomTableType>(["randomtables", selectedRandomTable.id], {
                  queryFn: async () =>
                    FetchFunction({
                      url: `${baseURLS.baseServer}getsinglerandomtable`,
                      method: "POST",
                      body: JSON.stringify({ id: selectedRandomTable.id }),
                    }),
                });
                setLoadingTableOptions(false);
                setResult(
                  getRandomTableResult({ ...selectedRandomTable, random_table_options: tableData.random_table_options }),
                );
              }
            }}>
            {buttonLabelWithIcon("Roll on table", "arcticons:reroll")}
          </Button>
          <hr className="border-zinc-700" />
          {result ? (
            <div
              className="overflow-y-auto"
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData("random_table_option_result", JSON.stringify(result));
              }}>
              <h4 className="select-none pb-2 font-Merriweather text-lg font-medium">
                {result.index + 1}. {result.title}
              </h4>
              {result?.description ? <p className="select-none font-Lato">{result.description}</p> : null}
            </div>
          ) : null}
          <div className="mt-auto border-t border-zinc-700 pt-1 font-Lato text-xs font-light italic text-zinc-400">
            Hint: you can drag and drop the result into the document editor to insert its text at the position of the
            editor&apos;s cursor.
          </div>
        </div>
      )}
    </div>
  );
}
