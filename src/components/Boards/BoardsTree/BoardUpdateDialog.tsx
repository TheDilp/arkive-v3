import { Button } from "primereact/button";
import { ColorPicker } from "primereact/colorpicker";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { TabPanel, TabView } from "primereact/tabview";
import { Dispatch, SetStateAction } from "react";
import { useParams } from "react-router-dom";
import {
  BoardItemDisplayDialogType,
  BoardNodeType,
  BoardType,
  NodeUpdateDialogType,
} from "../../../types/BoardTypes";
import {
  useDeleteNode,
  useGetBoards,
  useUpdateBoard,
} from "../../../utils/customHooks";
import { BoardUpdateDialogDefault } from "../../../utils/defaultValues";
import { dataTableTextEditor } from "../../Util/DataTableEditors";
import ImgDropdownItem from "../../Util/ImgDropdownItem";

type Props = {
  boardData: BoardItemDisplayDialogType;
  setBoardData: Dispatch<SetStateAction<BoardItemDisplayDialogType>>;
  setTemplateNode: Dispatch<SetStateAction<NodeUpdateDialogType>>;
};

export default function BoardUpdateDialog({
  boardData,
  setBoardData,
  setTemplateNode,
}: Props) {
  const { project_id } = useParams();
  const { data: boards } = useGetBoards(project_id as string);
  const updateBoardMutation = useUpdateBoard(project_id as string);
  const deleteNodeMutation = useDeleteNode(project_id as string);

  function recursiveDescendantRemove(
    doc: BoardType,
    index: number,
    array: BoardType[],
    selected_id: string
  ): boolean {
    if (doc.parent === null) {
      return true;
    } else {
      const parent = array.find((d) => d.id === doc.parent?.id);
      if (parent) {
        if (parent.id === selected_id) {
          return false;
        } else {
          return recursiveDescendantRemove(parent, index, array, selected_id);
        }
      } else {
        return false;
      }
    }
  }
  const imageBody = (rowData: BoardNodeType) =>
    rowData?.customImage?.link ? (
      <ImgDropdownItem title="" link={rowData?.customImage?.link || ""} />
    ) : (
      <div></div>
    );
  return (
    <Dialog
      header={`Update Board ${boardData.title}`}
      visible={boardData.show}
      modal={false}
      className="w-3"
      onHide={() => setBoardData(BoardUpdateDialogDefault)}
    >
      <TabView renderActiveOnly={true}>
        <TabPanel header="Board Data">
          <div className="flex flex-wrap justify-content-center row-gap-2">
            <div className="w-full">
              <label className="w-full text-sm text-gray-400">
                Board Title
              </label>
              <InputText
                placeholder="Board Title"
                className="w-full"
                value={boardData.title}
                onChange={(e) =>
                  setBoardData((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }))
                }
                autoFocus={true}
              />
            </div>

            <div className="w-full">
              <label className="w-full text-sm text-gray-400">
                Board Folder
              </label>

              <Dropdown
                className="w-full"
                placeholder="Board Folder"
                optionLabel="title"
                optionValue="id"
                value={boardData.parent}
                onChange={(e) =>
                  setBoardData((prev) => ({
                    ...prev,
                    parent: e.value,
                  }))
                }
                options={
                  boards
                    ? [
                        { title: "Root", id: null },
                        ...boards.filter((board, idx, array) => {
                          if (!board.folder || board.id === boardData.id)
                            return false;
                          return recursiveDescendantRemove(
                            board,
                            idx,
                            array,
                            boardData.id
                          );
                        }),
                      ]
                    : []
                }
              />
            </div>

            <div className="w-full flex flex-wrap justify-content-between align-items-center">
              <label className="w-full text-sm text-gray-400">
                Default Node Color
              </label>
              <InputText
                className="w-10"
                value={boardData.defaultNodeColor}
                onChange={(e) =>
                  setBoardData((prev) => ({
                    ...prev,
                    defaultNodeColor: e.target.value,
                  }))
                }
              />
              <ColorPicker
                value={boardData.defaultNodeColor}
                onChange={(e) =>
                  setBoardData((prev) => ({
                    ...prev,
                    defaultNodeColor: ("#" + e.value) as string,
                  }))
                }
              />
            </div>
            <div className="w-full flex flex-wrap justify-content-between align-items-center">
              <label className="w-full text-sm text-gray-400">
                Default Edge Color
              </label>
              <InputText
                className="w-10"
                value={boardData.defaultEdgeColor}
                onChange={(e) =>
                  setBoardData((prev) => ({
                    ...prev,
                    defaultEdgeColor: e.target.value,
                  }))
                }
              />
              <ColorPicker
                value={boardData.defaultEdgeColor}
                onChange={(e) =>
                  setBoardData((prev) => ({
                    ...prev,
                    defaultEdgeColor: ("#" + e.value) as string,
                  }))
                }
              />
            </div>

            <div className="w-full flex justify-content-end">
              <Button
                label={`Update ${boardData.folder ? "Folder" : "Board"}`}
                className="p-button-success p-button-outlined mt-2"
                icon="pi pi-save"
                iconPos="right"
                onClick={() =>
                  updateBoardMutation.mutate({
                    id: boardData.id,
                    title: boardData.title,
                    parent: boardData.parent === "0" ? null : boardData.parent,
                    defaultNodeColor: boardData.defaultNodeColor,
                    defaultEdgeColor: boardData.defaultEdgeColor,
                  })
                }
              />
            </div>
          </div>
        </TabPanel>
        <TabPanel header="Templates">
          {
            boards
              ?.find((board) => board.id === boardData.id)
              ?.nodes.filter((node) => node.template)[0]?.label
          }
          <DataTable
            value={
              boards
                ?.find((board) => board.id === boardData.id)
                ?.nodes.filter((node) => node.template) || []
            }
          >
            <Column
              field="label"
              header="Label"
              editor={dataTableTextEditor}
              frozen
            ></Column>

            <Column
              field="customImage"
              header="Image"
              body={imageBody}
            ></Column>
            <Column
              header="Edit"
              body={(rowData) => (
                <Button
                  icon="pi pi-pencil"
                  className="p-button-outlined"
                  onClick={() => {
                    const { document, ...rest } = rowData;
                    setTemplateNode({ ...rest, show: true });
                  }}
                />
              )}
            ></Column>
            <Column
              header="Delete"
              body={(rowData) => (
                <Button
                  icon="pi pi-trash"
                  className="p-button-outlined p-button-danger"
                  onClick={() => {
                    deleteNodeMutation.mutate({
                      id: rowData.id,
                      board_id: rowData.board_id,
                    });
                  }}
                />
              )}
            ></Column>
          </DataTable>
        </TabPanel>
      </TabView>
    </Dialog>
  );
}
