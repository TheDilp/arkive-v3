import {
  getBackendOptions,
  MultiBackend,
  NodeModel,
  Tree,
} from "@minoru/react-dnd-treeview";
import { TabPanel, TabView } from "primereact/tabview";
import { useContext, useEffect, useRef, useState } from "react";
import { DndProvider } from "react-dnd";
import { useParams } from "react-router-dom";
import {
  docItemDisplayDialogProps,
  DocumentProps,
  iconSelectProps,
} from "../../../custom-types";
import {
  useGetDocuments,
  useSortChildren,
  useUpdateDocument,
} from "../../../utils/customHooks";
import { docItemDisplayDialogDefault } from "../../../utils/defaultDisplayValues";
import { sortDocumentsChildren } from "../../../utils/supabaseUtils";
import { getDepth } from "../../../utils/utils";
import { MediaQueryContext } from "../../Context/MediaQueryContext";
import IconSelectMenu from "../../Util/IconSelectMenu";
import TreeSidebar from "../../Util/TreeSidebar";
import DocumentsFilterList from "./DocumentFilterList";
import DocumentTreeItem from "./DocumentTreeItem";
import DocumentTreeItemContext from "./DocumentTreeItemContext";
import DocumentUpdateDialog from "./DocumentUpdateDialog";
import DragPreview from "./DragPreview";
import TemplatesTree from "./TemplatesTree";
import DocTreeFilter from "./TreeFilter/DocTreeFilter";

export default function DocumentsTree() {
  const { project_id } = useParams();
  const [treeData, setTreeData] = useState<NodeModel<DocumentProps>[]>([]);
  const [filter, setFilter] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const { isTabletOrMobile, isLaptop } = useContext(MediaQueryContext);

  const { data: documents } = useGetDocuments(project_id as string);
  const [displayDialog, setDisplayDialog] = useState<docItemDisplayDialogProps>(
    docItemDisplayDialogDefault
  );
  const updateDocumentMutation = useUpdateDocument(project_id as string);
  const sortChildrenMutation = useSortChildren();
  const [iconSelect, setIconSelect] = useState<iconSelectProps>({
    id: "",
    icon: "",
    top: 0,
    left: 0,
    show: false,
  });
  // Function to handle the drop functionality of the tree
  const handleDrop = async (
    newTree: NodeModel<DocumentProps>[],
    {
      dragSourceId,
      dragSource,
      dropTargetId,
    }: {
      dragSourceId: string;
      dragSource: NodeModel<DocumentProps>;
      dropTargetId: string;
    }
  ) => {
    setTreeData(newTree);
    if (dragSource.data?.parent?.id !== dropTargetId) {
      // Update the document's parent
      // setTreeData(newTree);
      await updateDocumentMutation.mutateAsync({
        id: dragSourceId,
        parent: dropTargetId === "0" ? null : dropTargetId,
      });
      // return;
    }
    let indexes = newTree
      .filter(
        (doc) =>
          (doc.data?.parent?.id === dropTargetId ||
            (doc.data?.parent?.id === undefined && dropTargetId === "0")) &&
          !doc.data?.template
      )
      .map((doc, index) => {
        return { id: doc.id as string, sort: index };
      });
    sortChildrenMutation.mutate({
      project_id: project_id as string,
      type: "documents",
      indexes: indexes || [],
    });

    // SAFEGUARD: If parent is the same, avoid unneccesary update

    // sortChildrenMutation.mutate({
    //   project_id: project_id as string,
    //   type: "documents",
    //   indexes,
    // });
    // Set the user's current view to the new tree
  };
  // doc_id => param from URL
  // docId => state that's used for highlighting the current document in the tree
  const cm = useRef(null);

  useEffect(() => {
    if (documents) {
      const treeData = documents
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
  }, []);

  return (
    <div
      className={`text-white ${
        isTabletOrMobile ? "hidden" : isLaptop ? "w-3" : "w-2"
      } flex flex-wrap ${isTabletOrMobile ? "surface-0" : "surface-50"}`}
    >
      {iconSelect.show && (
        <IconSelectMenu {...iconSelect} setIconSelect={setIconSelect} />
      )}
      <DocumentTreeItemContext
        cm={cm}
        displayDialog={displayDialog}
        setDisplayDialog={setDisplayDialog}
      />
      {displayDialog.show && (
        <DocumentUpdateDialog
          displayDialog={displayDialog}
          setDisplayDialog={setDisplayDialog}
        />
      )}

      <TreeSidebar>
        <TabView
          className="w-full p-0 wikiTabs"
          panelContainerClassName="pr-0"
          renderActiveOnly={true}
        >
          <TabPanel header="Documents" className="p-0 surface-50">
            <DocTreeFilter
              filter={filter}
              setFilter={setFilter}
              selectedTags={selectedTags}
              setSelectedTags={setSelectedTags}
            />
            {!filter && selectedTags.length === 0 && (
              <DndProvider backend={MultiBackend} options={getBackendOptions()}>
                <Tree
                  classes={{
                    root: "w-full projectTreeRoot pr-4 pl-0",
                    container: "list-none",
                    placeholder: "relative",
                    listItem: "listitem",
                  }}
                  tree={treeData}
                  rootId={"0"}
                  sort={false}
                  insertDroppableFirst={false}
                  initialOpen={
                    documents
                      ?.filter((doc) => doc.expanded)
                      .map((doc) => doc.id) || false
                  }
                  render={(
                    node: NodeModel<DocumentProps>,
                    { depth, isOpen, onToggle }
                  ) => (
                    <DocumentTreeItem
                      // @ts-ignore
                      node={node}
                      depth={depth}
                      isOpen={isOpen}
                      onToggle={onToggle}
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
              </DndProvider>
            )}
            {(filter || selectedTags.length > 0) && (
              <DocumentsFilterList
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
              />
            )}
          </TabPanel>
          <TabPanel header="Templates" className="surface-50">
            <div className="h-screen">
              <TemplatesTree
                setIconSelect={setIconSelect}
                setDisplayDialog={setDisplayDialog}
                cm={cm}
              />
            </div>
          </TabPanel>
        </TabView>
      </TreeSidebar>
    </div>
  );
}
