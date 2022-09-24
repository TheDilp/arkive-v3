import { Dialog } from "primereact/dialog";
import React, { Dispatch, SetStateAction } from "react";
import { useParams } from "react-router-dom";
import {
  BoardItemDisplayDialogType,
  BoardNodeType,
} from "../../../types/BoardTypes";
import { useGetBoards } from "../../../utils/customHooks";
import { BoardUpdateDialogDefault } from "../../../utils/defaultValues";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import ImgDropdownItem from "../../Util/ImgDropdownItem";
import { Dropdown } from "primereact/dropdown";
type Props = {
  boardData: BoardItemDisplayDialogType;
  setBoardData: Dispatch<SetStateAction<BoardItemDisplayDialogType>>;
};

export default function BoardTemplateDialog({
  boardData,
  setBoardData,
}: Props) {
  const { project_id } = useParams();
  const { data: boards } = useGetBoards(project_id as string);

  const documentEditor = (rowData: BoardNodeType) => {
    return (
      <Dropdown
        className="w-full"
        placeholder="Document"
        optionLabel="title"
        optionValue="id"
        value={displayDialog.parent}
        filter
        onChange={(e) =>
          setDisplayDialog((prev) => ({ ...prev, parent: e.value }))
        }
        options={
          data
            ? [
                { title: "Root", id: null },
                ...data.filter((doc, idx, array) => {
                  if (!doc.folder || doc.id === displayDialog.id) return false;
                  return recursiveDescendantFilter(
                    doc,
                    idx,
                    array,
                    displayDialog.id
                  );
                }),
              ]
            : []
        }
      />
    );
  };

  const documentBody = (rowData: BoardNodeType) => (
    <div>{rowData.document?.title}</div>
  );
  const imageBody = (rowData: BoardNodeType) =>
    rowData?.customImage?.link ? (
      <ImgDropdownItem title="" link={rowData?.customImage?.link || ""} />
    ) : (
      <div></div>
    );

  return (
    <Dialog
      visible={boardData.showTemplates}
      onHide={() => setBoardData(BoardUpdateDialogDefault)}
      modal={false}
      className="w-6"
    >
      <DataTable
        scrollDirection="both"
        editMode="row"
        value={
          boards
            ?.find((board) => board.id === boardData.id)
            ?.nodes.filter((node) => node.template) || []
        }
        size="small"
      >
        <Column field="label" header="Label" frozen></Column>
        <Column header="Edit" rowEditor frozen></Column>
        <Column field="customImage" header="Image" body={imageBody}></Column>
        <Column field="width" header="Width"></Column>
        <Column field="height" header="Height"></Column>
        <Column field="fontSize" header="Font Size"></Column>
        <Column field="type" header="Shape"></Column>
        <Column field="backgroundColor" header="Color"></Column>
        <Column field="backgroundOpacity" header="Opacity"></Column>
        <Column field="document" header="Document" body={documentBody}></Column>
        <Column field="textHAlign" header="H. Align"></Column>
        <Column field="textVAlign" header="V. Align"></Column>
      </DataTable>
    </Dialog>
  );
}
