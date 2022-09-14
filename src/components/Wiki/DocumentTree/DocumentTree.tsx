import { NodeModel, Tree } from "@minoru/react-dnd-treeview";
import { TabPanel, TabView } from "primereact/tabview";
import {
  useContext, useLayoutEffect,
  useRef,
  useState
} from "react";
import { useParams } from "react-router-dom";
import {
  DocItemDisplayDialogProps,
  DocumentProps,
  IconSelectProps,
  SortIndexes
} from "../../../custom-types";
import {
  useGetDocuments,
  useSortChildren
} from "../../../utils/customHooks";
import { DocItemDisplayDialogDefault } from "../../../utils/defaultValues";
import { getDepth, handleDrop, TreeSortFunc } from "../../../utils/utils";
import { MediaQueryContext } from "../../Context/MediaQueryContext";
import IconSelectMenu from "../../Util/IconSelectMenu";
import TreeSidebar from "../../Util/TreeSidebar";
import DocumentTreeItem from "./DocumentTreeItem";
import DocumentTreeItemContext from "./DocumentTreeItemContext";
import DocumentUpdateDialog from "./DocumentUpdateDialog";
import DragPreview from "./DragPreview";
import TemplatesTree from "./TemplatesTree/TemplatesTree";
import DocTreeFilter from "./TreeFilter/DocTreeFilter";

export default function DocumentsTree() {
  const { project_id } = useParams();
  const [treeData, setTreeData] = useState<NodeModel<DocumentProps>[]>([]);
  const [filter, setFilter] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const { isTabletOrMobile, isLaptop } = useContext(MediaQueryContext);

  const { data: documents } = useGetDocuments(project_id as string);
  const [displayDialog, setDisplayDialog] = useState<DocItemDisplayDialogProps>(
    DocItemDisplayDialogDefault
  );
  const sortChildrenMutation = useSortChildren();
  const [iconSelect, setIconSelect] = useState<IconSelectProps>({
    id: "",
    icon: "",
    top: 0,
    left: 0,
    show: false,
  });
  // Function to handle the drop functionality of the tree
  // const handleDrop = async (
  //   newTree: NodeModel<DocumentProps>[],
  //   {
  //     dragSourceId,
  //     dragSource,
  //     dropTargetId,
  //   }: {
  //     dragSourceId: string;
  //     dragSource: NodeModel<DocumentProps>;
  //     dropTargetId: string;
  //   }
  // ) => {

  //   let indexes: SortIndexes = newTree
  //     .filter(
  //       (doc) =>
  //         (doc.parent === dropTargetId ||
  //           (doc.parent === undefined && dropTargetId === "0")) &&
  //         !doc.data?.template
  //     )
  //     .map((doc, index) => {
  //       // doc.parent.toString() => Dnd Treeview allows for strings and numbers, we want only strings
  //       return { id: doc.id as string, sort: index, parent: doc.parent === "0" ? null : doc.parent as string };
  //     });
  //   setTreeData(newTree);
  //   sortChildrenMutation.mutate({
  //     project_id: project_id as string,
  //     type: "documents",
  //     indexes: indexes || [],
  //   })
  //   // setTreeData(newTree);

  // };
  // doc_id => param from URL
  // docId => state that's used for highlighting the current document in the tree
  const cm = useRef(null);

  useLayoutEffect(() => {
    if (documents) {
      if (filter) {
        const timeout = setTimeout(() => {
          setTreeData(
            documents
              .filter(
                (doc) =>
                  !doc.folder &&
                  !doc.template &&
                  doc.title.toLowerCase().includes(filter.toLowerCase()) &&
                  selectedTags.every((tag) => doc.categories.includes(tag))
              )
              .map((doc) => ({
                id: doc.id,
                text: doc.title,
                droppable: doc.folder,
                parent: "0",
                data: doc,
              }))
          );
        }, 300);
        return () => clearTimeout(timeout);
      } else {
        const treeData = documents
          .filter((doc) => !doc.template).sort((a, b) => TreeSortFunc(a.sort, b.sort))
          .map((doc) => ({
            id: doc.id,
            text: doc.title,
            droppable: doc.folder,
            parent: doc.parent ? (doc.parent.id as string) : "0",
            data: doc,
          }))
        setTreeData(treeData);
      }
    }
  }, [documents, filter, selectedTags]);

  return (
    <div
      className={`text-white ${isTabletOrMobile ? "hidden" : isLaptop ? "w-3" : "w-2"
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
          <TabPanel header="Documents" className="p-0 surface-50 ">
            <DocTreeFilter
              filter={filter}
              setFilter={setFilter}
              selectedTags={selectedTags}
              setSelectedTags={setSelectedTags}
            />
            <Tree
              classes={{
                root: "w-full projectTreeRoot pr-4 pl-0  overflow-y-auto",
                container: "list-none",
                placeholder: "relative",
                listItem: "listitem",
              }}
              tree={treeData}
              rootId={"0"}
              sort={false}
              insertDroppableFirst={false}
              initialOpen={
                documents?.filter((doc) => doc.expanded).map((doc) => doc.id) ||
                false
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
                  setIconSelect={setIconSelect}
                  setDisplayDialog={setDisplayDialog}
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
              onDrop={(tree, options) => handleDrop(tree, options, setTreeData, sortChildrenMutation, project_id as string, "documents")}
            />
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
