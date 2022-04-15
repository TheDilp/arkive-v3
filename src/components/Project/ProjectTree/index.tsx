import { NodeModel, Tree } from "@minoru/react-dnd-treeview";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { useEffect, useRef, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import {
  Document,
  iconSelect,
  treeItemDisplayDialog
} from "../../../custom-types";
import { auth, updateDocument } from "../../../utils/supabaseUtils";
import {
  getDepth,
  toastError, useCreateDocument
} from "../../../utils/utils";
import DragPreview from "./DragPreview";
import IconSelectMenu from "./IconSelectMenu";
import ProjectTreeItem from "./ProjectTreeItem";
import ProjectTreeItemContext from "./ProjectTreeItemContext";
type Props = {
  docId: string;
  setDocId: (docId: string) => void;
};

export default function ProjectTree({ docId, setDocId }: Props) {
  const queryClient = useQueryClient();
  const { project_id, doc_id } = useParams();
  const [treeData, setTreeData] = useState<NodeModel[]>([]);
  const navigate = useNavigate();
  const [filter, setFilter] = useState("");
  const [displayDialog, setDisplayDialog] = useState<treeItemDisplayDialog>({
    id: "",
    title: "",
    show: false,
  });
  const [iconSelect, setIconSelect] = useState<iconSelect>({
    doc_id: "",
    icon: "",
    top: 0,
    left: 0,
    show: false,
  });
  // Function to handle the drop functionality of the tree
  const handleDrop = (
    newTree: NodeModel[],
    {
      dragSourceId,
      dropTargetId,
    }: { dragSourceId: string; dropTargetId: string }
  ) => {
    // Set the user's current view to the new tree
    setTreeData(newTree);

    // Update the document's parent
    updateDocument(
      dragSourceId,
      undefined,
      undefined,
      undefined,
      undefined,
      dropTargetId === "0" ? null : dropTargetId
    );
  };
  // doc_id => param from URL
  // docId => state that's used for highlighting the current document in the tree
  const cm = useRef(null);

  const documentTitleMutation = useMutation(
    async (vars: { docId: string; title: string }) => {
      await updateDocument(vars.docId, vars.title);
    },
    {
      onMutate: async (updatedDocument) => {
        setDisplayDialog({ id: "", title: "", show: false });
        await queryClient.cancelQueries(`${project_id}-documents`);

        const previousDocuments = queryClient.getQueryData(
          `${project_id}-documents`
        );
        queryClient.setQueryData(
          `${project_id}-documents`,
          (oldData: Document[] | undefined) => {
            if (oldData) {
              let newData: Document[] = oldData.map((doc) => {
                if (doc.id === updatedDocument.docId) {
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

        return { previousDocuments };
      },
      onError: (err, newTodo, context) => {
        queryClient.setQueryData(
          `${project_id}-documents`,
          context?.previousDocuments
        );
        toastError("There was an error updating your document.");
      },
    }
  );

  useEffect(() => {
    let docs: Document[] | undefined = queryClient.getQueryData(
      `${project_id}-documents`
    );
    if (docs) {
      const treeData = docs.map((doc) => ({
        id: doc.id,
        text: doc.title,
        droppable: doc.folder,
        parent: doc.parent ? (doc.parent.id as string) : "0",
        data: doc,
      }));
      setTreeData(treeData);
    }
  }, [queryClient.getQueryData(`${project_id}-documents`)]);

  useEffect(() => {
    if (doc_id) {
      setDocId(doc_id);
    }
  }, [doc_id]);
  const createDocument = useCreateDocument(
    project_id as string,
    auth.user()?.id as string
  );
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
          setDisplayDialog({
            id: "",
            title: "",
            show: false,
          })
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
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    documentTitleMutation.mutate({
                      docId: displayDialog.id,
                      title: displayDialog.title,
                    });
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
                onClick={() =>
                  documentTitleMutation.mutate({
                    docId: displayDialog.id,
                    title: displayDialog.title,
                  })
                }
              />
            </div>
          </div>
        )}
      </Dialog>
      <IconSelectMenu {...iconSelect} setIconSelect={setIconSelect} />
      <div className="pt-2 px-2 w-full">
        <div className="w-full py-1">
          <Button
            label="New Document"
            icon={"pi pi-fw pi-plus"}
            iconPos="right"
            className="p-button-outlined Lato"
            onClick={() => createDocument.mutate()}
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
            placeholder: "relative",
          }}
          tree={treeData}
          rootId={"0"}
          sort={false}
          render={(node: NodeModel, { depth, isOpen, onToggle }) => (
            <ProjectTreeItem
              // @ts-ignore
              node={node}
              depth={depth}
              isOpen={isOpen}
              onToggle={onToggle}
              docId={docId}
              setDocId={setDocId}
              setDisplayDialog={setDisplayDialog}
              setIconSelect={setIconSelect}
              cm={cm}
            />
          )}
          dragPreviewRender={(monitorProps) => (
            <DragPreview
              text={monitorProps.item.text}
              droppable={monitorProps.item.droppable}
            />
          )}
          placeholderRender={(node, { depth }) => (
            <div
              style={{
                top: 0,
                right: 0,
                left: depth * 24,
                backgroundColor: "#1967d2",
                height: "2px",
                position: "absolute",
                transform: "translateY(-50%)",
              }}
            ></div>
          )}
          dropTargetOffset={10}
          canDrop={(tree, { dragSource, dropTargetId }) => {
            const depth = getDepth(treeData, dropTargetId);
            // Don't allow nesting documents beyond this depth
            if (depth > 3) return false;
            if (dragSource?.parent === dropTargetId) {
              return true;
            }
          }}
          // @ts-ignore
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
