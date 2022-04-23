import { NodeModel, Tree } from "@minoru/react-dnd-treeview";
import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import {
  Document,
  iconSelect,
  treeItemDisplayDialog,
} from "../../../custom-types";
import { useUpdateDocument } from "../../../utils/customHooks";
import { getDepth } from "../../../utils/utils";
import DragPreview from "./DragPreview";
import FilterList from "./FilterList";
import IconSelectMenu from "./IconSelectMenu";
import ProjectTreeItem from "./ProjectTreeItem";
import ProjectTreeItemContext from "./ProjectTreeItemContext";
import RenameDialog from "./RenameDialog";
import TreeFilter from "./TreeFilter/TreeFilter";
import { TabView, TabPanel } from "primereact/tabview";
import TemplatesTree from "./TemplatesTree";
type Props = {
  docId: string;
  setDocId: (docId: string) => void;
};

export default function ProjectTree({ docId, setDocId }: Props) {
  const queryClient = useQueryClient();
  const { project_id, doc_id } = useParams();
  const [treeData, setTreeData] = useState<NodeModel<Document>[]>([]);
  const [filter, setFilter] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [displayDialog, setDisplayDialog] = useState<treeItemDisplayDialog>({
    id: "",
    title: "",
    show: false,
    folder: false,
    depth: 0,
  });
  const updateDocumentMutation = useUpdateDocument(project_id as string);
  const [iconSelect, setIconSelect] = useState<iconSelect>({
    doc_id: "",
    icon: "",
    top: 0,
    left: 0,
    show: false,
  });
  // Function to handle the drop functionality of the tree
  const handleDrop = (
    newTree: NodeModel<Document>[],
    {
      dragSourceId,
      dropTargetId,
    }: { dragSourceId: string; dropTargetId: string }
  ) => {
    // Set the user's current view to the new tree
    setTreeData(newTree);

    // Update the document's parent
    updateDocumentMutation.mutate({
      doc_id: dragSourceId,
      parent: dropTargetId === "0" ? null : dropTargetId,
    });
  };
  // doc_id => param from URL
  // docId => state that's used for highlighting the current document in the tree
  const cm = useRef(null);

  const docs: Document[] | undefined = queryClient.getQueryData(
    `${project_id}-documents`
  );
  useEffect(() => {
    if (docs) {
      const treeData = docs
        .filter((doc) => !doc.template)
        .map((doc) => ({
          id: doc.id,
          text: doc.title,
          droppable: doc.folder,
          parent: doc.parent ? (doc.parent.id as string) : "0",
          data: doc,
        }));
      setTreeData(treeData);
    }
  }, [docs]);

  useEffect(() => {
    if (doc_id) {
      setDocId(doc_id);
    }
  }, [doc_id]);
  return (
    <div className="text-white w-2 flex flex-wrap surface-50">
      {iconSelect.show && (
        <IconSelectMenu {...iconSelect} setIconSelect={setIconSelect} />
      )}
      <TabView className="w-full" renderActiveOnly={true}>
        <TabPanel header="Documents">
          <ProjectTreeItemContext
            cm={cm}
            docId={docId}
            displayDialog={displayDialog}
            setDisplayDialog={setDisplayDialog}
          />
          <RenameDialog
            displayDialog={displayDialog}
            setDisplayDialog={setDisplayDialog}
          />

          <TreeFilter
            filter={filter}
            setFilter={setFilter}
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
          />
          {!filter && selectedTags.length === 0 && (
            <Tree
              classes={{
                root: "w-full overflow-y-auto projectTreeRoot",
                container: "list-none",
                placeholder: "relative",
              }}
              tree={treeData}
              rootId={"0"}
              sort={false}
              initialOpen={false}
              render={(
                node: NodeModel<Document>,
                { depth, isOpen, onToggle }
              ) => (
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
          {(filter || selectedTags.length > 0) && (
            <FilterList
              filteredTree={treeData
                .filter((node) =>
                  node.text.toLowerCase().includes(filter.toLowerCase())
                )
                .filter((node) =>
                  selectedTags.length > 0
                    ? node.data?.categories.some((category) =>
                        selectedTags.includes(category)
                      )
                    : true
                )}
              setDocId={setDocId}
            />
          )}
        </TabPanel>
        <TabPanel header="Templates">
          <div className="h-screen">
            <TemplatesTree setDocId={setDocId} setIconSelect={setIconSelect} />
          </div>
        </TabPanel>
      </TabView>
    </div>
  );
}
