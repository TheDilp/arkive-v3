import { NodeModel, Tree } from "@minoru/react-dnd-treeview";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { createDocument } from "../../utils/supabaseUtils";
import { useQueryClient } from "react-query";
import { Document } from "../../custom-types";
import { toastSuccess } from "../../utils/utils";
type Props = {
  treeData: NodeModel[];
  setTreeData: (treeData: NodeModel[]) => void;
  docId: string;
  setDocId: (docId: string) => void;
};

export default function ProjectTree({
  treeData,
  setTreeData,
  docId,
  setDocId,
}: Props) {
  const queryClient = useQueryClient();
  const handleDrop = (newTree: NodeModel[]) => setTreeData(newTree);
  const navigate = useNavigate();
  const [filter, setFilter] = useState("");
  // doc_id => param from URL
  // docId => state that's used for highlighting the current document in the tree
  const { project_id, doc_id } = useParams();

  useEffect(() => {
    if (doc_id) {
      setDocId(doc_id);
    }
  }, [doc_id]);

  return (
    <div className="text-white w-2 flex flex-wrap surface-50">
      <div className="pt-2 px-2 w-full">
        <div className="w-full py-1">
          <Button
            label="New Document"
            icon={"pi pi-fw pi-plus"}
            iconPos="right"
            className="p-button-outlined"
            onClick={async () => {
              const newDocument = (await createDocument(
                project_id as string,
                "0"
              )) as Document;
              toastSuccess("New Document created!");
              queryClient.setQueryData(
                `${project_id}-documents`,
                (oldData: Document[] | undefined) => {
                  if (oldData) {
                    console.log(oldData);
                    const newData = [...oldData, newDocument];
                    return newData;
                  } else {
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
            root: "list-none w-full overflow-y-scroll projectTreeRoot",
            container: "list-none cursor-pointer",
          }}
          tree={treeData}
          rootId={"0"}
          render={(node, { depth, isOpen, onToggle }) => (
            <div
              style={{ marginInlineStart: depth * 10 }}
              className={`text-lg hover:bg-blue-300 py-1 ${
                docId === node.id ? "bg-primary" : ""
              }`}
              onClick={() => {
                setDocId(node.id as string);
                navigate(doc_id === undefined ? `./${node.id}` : `./${doc_id}`);
              }}
            >
              {node.droppable && (
                <span
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onToggle();
                  }}
                >
                  {isOpen ? (
                    <i className="pi pi-fw pi-chevron-down"></i>
                  ) : (
                    <i className="pi pi-fw pi-chevron-right"></i>
                  )}
                </span>
              )}
              {node.text}
            </div>
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
        <ul className="h-screen list-none text-lg">
          {treeData
            .filter((node) =>
              node.text.toLowerCase().includes(filter.toLowerCase())
            )
            .map((node) => (
              <li
                className="hover:bg-primary cursor-pointer"
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
