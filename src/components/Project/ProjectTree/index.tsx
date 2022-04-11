import { NodeModel, Tree } from "@minoru/react-dnd-treeview";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { Document, treeItemDisplayDialog } from "../../../custom-types";
import { createDocument, updateDocument } from "../../../utils/supabaseUtils";
import { toastError, toastSuccess } from "../../../utils/utils";
import ProjectTreeItem from "./ProjectTreeItem";
import ProjectTreeItemContext from "./ProjectTreeItemContext";
type Props = {
  treeData: NodeModel[];
  docId: string;
  setTreeData: (treeData: NodeModel[]) => void;
  setDocId: (docId: string) => void;
  setDocuments: (documents: Document[]) => void;
};

export default function ProjectTree({
  treeData,
  docId,
  setTreeData,
  setDocId,
  setDocuments,
}: Props) {
  const queryClient = useQueryClient();
  const handleDrop = (
    newTree: NodeModel[],
    {
      dragSourceId,
      dropTargetId,
    }: { dragSourceId: string; dropTargetId: string }
  ) => {
    setTreeData(newTree);
    updateDocument(
      dragSourceId,
      undefined,
      undefined,
      undefined,
      undefined,
      dropTargetId
    );
  };
  const navigate = useNavigate();
  const [filter, setFilter] = useState("");
  const [displayDialog, setDisplayDialog] = useState<treeItemDisplayDialog>({
    id: "",
    title: "",
    show: false,
  });
  // doc_id => param from URL
  // docId => state that's used for highlighting the current document in the tree
  const { project_id, doc_id } = useParams();
  const cm = useRef(null);

  async function updateDocumentTitle(docId: string, title: string) {
    await updateDocument(docId, title)
      .then((data: Document | undefined) => {
        if (data) {
          setDisplayDialog({ id: "", title: "", show: false });
          let updatedDocument = data;
          queryClient.setQueryData(
            `${project_id}-documents`,
            (oldData: Document[] | undefined) => {
              if (oldData) {
                let newData: Document[] = oldData.map((doc) => {
                  if (doc.id === updatedDocument.id) {
                    return { ...doc, title: updatedDocument.title };
                  } else {
                    return doc;
                  }
                });
                return newData;
              } else {
                return [];
              }
            }
          );
          toastSuccess(`Document ${updatedDocument.title} saved`);
        }
      })
      .catch((err) => toastError("There was an error updating the document"));
  }

  useEffect(() => {
    if (doc_id) {
      setDocId(doc_id);
    }
  }, [doc_id]);
  return (
    <div className="text-white w-2 flex flex-wrap surface-50 ">
      <ProjectTreeItemContext
        cm={cm}
        displayDialog={displayDialog as treeItemDisplayDialog}
        setDisplayDialog={setDisplayDialog}
      />
      <Dialog
        header={`Edit ${displayDialog.title}`}
        visible={displayDialog.show}
        className="w-3"
        onHide={() =>
          setDisplayDialog((displayDialog) => ({
            id: "",
            title: "",
            show: false,
          }))
        }
        modal={false}
      >
        {displayDialog && (
          <div className="w-full">
            <div className="my-2">
              <InputText
                className="w-full"
                value={displayDialog.title}
                onChange={(e) =>
                  setDisplayDialog((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }))
                }
                onKeyDown={async (e) => {
                  if (e.key === "Enter") {
                    await updateDocumentTitle(
                      displayDialog.id,
                      displayDialog.title
                    );
                  }
                }}
              />
            </div>
            <div className="flex w-full">
              <Button
                className="ml-auto p-button-raised p-button-text p-button-success"
                label="Save"
                icon="pi pi-fw pi-save"
                iconPos="right"
                onClick={async () =>
                  await updateDocumentTitle(
                    displayDialog.id,
                    displayDialog.title
                  )
                }
              />
            </div>
          </div>
        )}
      </Dialog>
      <div className="pt-2 px-2 w-full">
        <div className="w-full py-1">
          <Button
            label="New Document"
            icon={"pi pi-fw pi-plus"}
            iconPos="right"
            className="p-button-outlined Lato"
            onClick={async () => {
              const newDocument = (await createDocument(
                project_id as string,
                undefined
              )) as Document;
              toastSuccess("New Document created!");
              queryClient.setQueryData(
                `${project_id}-documents`,
                (oldData: Document[] | undefined) => {
                  if (oldData) {
                    const newData = [...oldData, newDocument];
                    setDocuments(newData);
                    return newData;
                  } else {
                    setDocuments([newDocument]);
                    return [newDocument];
                  }
                }
              );
            }}
          />
        </div>
        <InputText
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full p-1"
          placeholder="Filter Documents"
        />
      </div>
      {!filter && (
        <Tree
          classes={{
            root: "list-none w-full overflow-y-scroll projectTreeRoot ",
            container: "list-none cursor-pointer ",
          }}
          tree={treeData}
          rootId={"0"}
          render={(node, { depth, isOpen, onToggle }) => (
            <ProjectTreeItem
              node={node}
              depth={depth}
              isOpen={isOpen}
              onToggle={onToggle}
              docId={docId}
              setDocId={setDocId}
              setDisplayDialog={setDisplayDialog}
              cm={cm}
            />
          )}
          dragPreviewRender={(monitorProps) => (
            <div
              style={{
                backgroundColor: "blue",
                width: "10%",
                position: "absolute",
              }}
            >
              {monitorProps.item.text}
            </div>
          )}
          onDrop={handleDrop}
        />
      )}
      {filter && (
        <ul className="h-screen list-none text-lg ">
          {treeData
            .filter((node) =>
              node.text.toLowerCase().includes(filter.toLowerCase())
            )
            .map((node) => (
              <li
                className="hover:bg-primary cursor-pointer Lato"
                onClick={() => {
                  setDocId(node.id as string);
                  navigate(
                    doc_id === undefined ? `./${node.id}` : `./${doc_id}`
                  );
                }}
              >
                {node.text}
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}
