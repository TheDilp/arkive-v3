import { Icon } from "@iconify/react";
import { UseMutateFunction } from "@tanstack/react-query";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable, DataTableExpandedRows } from "primereact/datatable";
import { TabPanel, TabView } from "primereact/tabview";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";

import AlterNameTagTitle from "../../components/Settings/Columns/AlterNameTagTitle";
import { TitleEditor } from "../../components/Settings/Editors/TitleEditor";
import { useDeleteTags, useGetTagSettings, useUpdateAlterNameTag } from "../../CRUD/OtherCRUD";
import { TagSettingsType, TagType } from "../../types/generalTypes";
import { deleteItem } from "../../utils/Confirms/Confirm";
import { IconEnum } from "../../utils/DefaultValues/GeneralDefaults";
import { toaster } from "../../utils/toast";

function DeleteColumn(item: TagType, deleteTags: UseMutateFunction<any, unknown, string[], unknown>) {
  const { id } = item;
  return (
    <div className="flex justify-center gap-x-1">
      <Button
        className="p-button-outlined p-button-danger"
        icon="pi pi-fw pi-trash"
        onClick={() =>
          deleteItem("Are you sure you want to delete this tag?", () =>
            deleteTags([id], {
              onSuccess: () => toaster("success", "Tag successfully deleted."),
            }),
          )
        }
        tooltip="Delete tag"
        tooltipOptions={{ showDelay: 300, position: "left" }}
      />
    </div>
  );
}

function ExpandedSection(tag: TagSettingsType, project_id: string) {
  if (!tag) return null;
  const { documents, maps, map_pins, boards, nodes, edges, calendars, events, screens, cards, dictionaries } = tag;
  return (
    <TabView className="tagSettings h-[15rem]" panelContainerClassName="h-full" renderActiveOnly>
      <TabPanel contentClassName="overflow-hidden h-full" disabled={!documents.length} header="Documents">
        <div className="flex h-full w-full flex-col gap-y-2 overflow-auto px-2">
          {documents.map((doc) => (
            <Link
              key={doc.id}
              className="flex cursor-pointer items-center gap-x-1 pl-1 hover:text-sky-400"
              to={`/project/${project_id}/documents${doc.folder ? "/folder" : ""}/${doc.id}`}>
              <Icon icon={doc.icon} />
              {doc.title}
            </Link>
          ))}
        </div>
      </TabPanel>

      <TabPanel contentClassName="overflow-hidden h-full" disabled={!maps.length} header="Maps">
        <div className="flex h-full w-full flex-col gap-y-2 overflow-auto px-2">
          {maps.map((map) => (
            <Link
              key={map.id}
              className="flex cursor-pointer items-center gap-x-1 pl-1 hover:text-sky-400"
              to={`/project/${project_id}/maps${map.folder ? "/folder" : ""}/${map.id}`}>
              <Icon icon={map.icon} />
              {map.title}
            </Link>
          ))}
        </div>
      </TabPanel>
      <TabPanel contentClassName="overflow-hidden h-full" disabled={!maps.length} header="Map pins">
        <div className="flex h-full w-full flex-col gap-y-2 overflow-auto px-2">
          {map_pins.map((map_pin) => (
            <Link
              key={map_pin.id}
              className="flex cursor-pointer items-center gap-x-1 pl-1 hover:text-sky-400"
              to={`/project/${project_id}/maps/${map_pin.parentId}/${map_pin.id}`}>
              <Icon icon={map_pin?.icon || IconEnum.map_pin} />
              {map_pin?.text || "Unnamed pin"}
            </Link>
          ))}
        </div>
      </TabPanel>
      <TabPanel contentClassName="overflow-hidden h-full" disabled={!boards.length} header="Graphs">
        <div className="flex h-full w-full flex-col gap-y-2 overflow-auto px-2">
          {boards.map((board) => (
            <Link
              key={board.id}
              className="flex cursor-pointer items-center gap-x-1 pl-1 hover:text-sky-400"
              to={`/project/${project_id}/boards${board.folder ? "/folder" : ""}/${board.id}`}>
              <Icon icon={board.icon} />
              {board.title}
            </Link>
          ))}
        </div>
      </TabPanel>
      <TabPanel contentClassName="overflow-hidden h-full" disabled={!nodes.length} header="Nodes">
        <div className="flex h-full w-full flex-col gap-y-2 overflow-auto px-2">
          {nodes.map((node) => (
            <Link
              key={node.id}
              className="flex cursor-pointer items-center gap-x-1 pl-1 hover:text-sky-400"
              to={`/project/${project_id}/boards/${node.parentId}/${node.id}`}>
              <Icon icon={IconEnum.board} />
              {node.label || "Unlabeled node"}
            </Link>
          ))}
        </div>
      </TabPanel>
      <TabPanel contentClassName="overflow-hidden h-full" disabled={!edges.length} header="Edges">
        <div className="flex h-full w-full flex-col gap-y-2 overflow-auto px-2">
          {edges.map((edge) => (
            <Link
              key={edge.id}
              className="flex cursor-pointer items-center hover:text-sky-400"
              to={`/project/${project_id}/boards/${edge.parentId}/${edge.id}`}>
              <Icon icon={IconEnum.board} />
              {edge.label || "Unlabeled edge"}{" "}
              {`(${edge?.source?.label || "Unlabeled node"} - ${edge?.target?.label || "Unlabeled node"})`}
            </Link>
          ))}
        </div>
      </TabPanel>
      <TabPanel contentClassName="overflow-hidden h-full" disabled={!calendars.length} header="Calendars">
        <div className="flex h-full w-full flex-col gap-y-2 overflow-auto px-2">
          {calendars.map((calendar) => (
            <Link
              key={calendar.id}
              className="flex cursor-pointer items-center hover:text-sky-400"
              to={`/project/${project_id}/calendars${calendar.folder ? "/folder" : ""}/${calendar.id}`}>
              <Icon icon={IconEnum.board} />
              {calendar.title}
            </Link>
          ))}
        </div>
      </TabPanel>
      <TabPanel contentClassName="overflow-hidden h-full" disabled={!events.length} header="Events">
        <div className="flex h-full w-full flex-col gap-y-2 overflow-auto px-2">
          {events
            ? events?.map((event) => (
                <Link
                  key={event.id}
                  className="flex cursor-pointer items-center hover:text-sky-400"
                  to={`/project/${project_id}/calendars/${event.calendarsId}/${event.id}`}>
                  <Icon icon={IconEnum.board} />
                  {event.title}
                </Link>
              ))
            : null}
        </div>
      </TabPanel>
      <TabPanel contentClassName="overflow-hidden h-full" disabled={!screens.length} header="Screens">
        <div className="flex h-full w-full flex-col gap-y-2 overflow-auto px-2">
          {screens.map((screen) => (
            <Link
              key={screen.id}
              className="flex cursor-pointer items-center hover:text-sky-400"
              to={`/project/${project_id}/screens${screen.folder ? "/folder" : ""}/${screen.id}`}>
              <Icon icon={IconEnum.board} />
              {screen.title || "Unlabeled edge"}
            </Link>
          ))}
        </div>
      </TabPanel>
      <TabPanel contentClassName="overflow-hidden h-full" disabled={!cards.length} header="Cards">
        <div className="flex h-full w-full flex-col gap-y-2 overflow-auto px-2">
          {cards.map((card) => (
            <Link
              key={card.id}
              className="flex cursor-pointer items-center hover:text-sky-400"
              to={`/project/${project_id}/screens/${card.parentId}/${card.id}`}>
              <Icon icon={IconEnum.board} />
              {card.document.title}
            </Link>
          ))}
        </div>
      </TabPanel>
      <TabPanel contentClassName="overflow-hidden h-full" disabled={!dictionaries.length} header="Dictionaries">
        <div className="flex h-full w-full flex-col gap-y-2 overflow-auto px-2">
          {dictionaries.map((dictionary) => (
            <Link
              key={dictionary.id}
              className="flex cursor-pointer items-center hover:text-sky-400"
              to={`/project/${project_id}/dictionaries${dictionary.folder ? "/folder" : ""}/${dictionary.id}`}>
              <Icon icon={IconEnum.board} />
              {dictionary.title}
            </Link>
          ))}
        </div>
      </TabPanel>
    </TabView>
  );
}

export default function TagsSettings() {
  const { project_id } = useParams();
  const [selected, setSelected] = useState<string[]>([]);
  const [expandedRows, setExpandedRows] = useState<any[] | DataTableExpandedRows>([]);
  const { data: tags, isLoading: isLoadingTags } = useGetTagSettings(project_id as string);
  const { mutate: updateTag } = useUpdateAlterNameTag(project_id as string, "tag");
  const { mutate: deleteTags } = useDeleteTags(project_id as string);
  return (
    <div className="tagSettings h-screen px-4 pt-4 pb-16">
      <DataTable
        editMode="cell"
        expandedRows={expandedRows}
        loading={isLoadingTags}
        onRowToggle={(e) => setExpandedRows(e.data)}
        onSelectionChange={(e) => setSelected(e.value)}
        paginator
        removableSort
        rowExpansionTemplate={(data) => ExpandedSection(data, project_id as string)}
        rows={10}
        selection={selected}
        selectionMode="checkbox"
        size="small"
        sortMode="multiple"
        value={tags}>
        <Column headerClassName="w-12" selectionMode="multiple" />
        <Column className="w-8" expander />
        <Column
          body={AlterNameTagTitle}
          editor={(e) => TitleEditor(e, (data) => updateTag(data))}
          field="title"
          header="Tag"
          sortable
        />
        <Column align="center" body={(e) => DeleteColumn(e, deleteTags)} className="w-28" header="Delete Tag" />
      </DataTable>
    </div>
  );
}
