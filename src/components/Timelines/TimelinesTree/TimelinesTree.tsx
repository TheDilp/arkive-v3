import { NodeModel, Tree } from '@minoru/react-dnd-treeview';
import { useContext, useLayoutEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { TimelineItemDisplayDialogProps, TimelineType } from '../../../types/TimelineTypes';
import { useGetTimelines, useSortChildren } from '../../../utils/customHooks';
import { TimelineItemDisplayDialogDefault } from '../../../utils/defaultValues';
import { getDepth, handleDrop, TreeSortFunc } from '../../../utils/utils';
import { MediaQueryContext } from '../../Context/MediaQueryContext';
import { TimelineContext } from '../../Context/TimelineContext';
import TreeSidebar from '../../Util/TreeSidebar';
import DragPreview from '../../Wiki/DocumentTree/DragPreview';
import TimelineDialog from './TimelineDialog';
import TimelinesFilter from './TimelinesFilter';
import TimelineTreeItem from './TimelineTreeItem';
import TimelineTreeItemContext from './TimelineTreeItemContext';


export default function TimelinesTree() {
    const { project_id } = useParams();
    const { timelineId, setTimelineId } = useContext(TimelineContext);
    const { isTabletOrMobile } = useContext(MediaQueryContext)
    const [treeData, setTreeData] = useState<NodeModel<TimelineType>[]>([]);
    const [updateTimelineDialog, setUpdateTimelineDialog] = useState<TimelineItemDisplayDialogProps>(TimelineItemDisplayDialogDefault)
    const [filter, setFilter] = useState("");
    const { data: timelines } = useGetTimelines(project_id as string);
    const sortChildrenMutation = useSortChildren();
    const cm = useRef() as any;

    useLayoutEffect(() => {
        if (timelines) {
            if (filter) {
                const timeout = setTimeout(() => {
                    setTreeData(
                        timelines
                            .filter(
                                (timeline) =>
                                    !timeline.folder &&
                                    timeline.title.toLowerCase().includes(filter.toLowerCase())
                            )
                            .map((t) => ({
                                id: t.id,
                                parent: "0",
                                text: t.title,
                                droppable: t.folder,
                                data: t,
                            }))
                    );
                }, 300);
                return () => clearTimeout(timeout);
            } else {
                setTreeData(
                    timelines.sort((a, b) => TreeSortFunc(a.sort, b.sort)).map((t) => ({
                        id: t.id,
                        parent: t.parent?.id || "0",
                        text: t.title,
                        droppable: t.folder,
                        data: t,
                    }))
                );
            }
        } else {
            setTreeData([]);
        }
    }, [timelines, filter]);

    return (
        <div
            className={`text-white pt-2 px-2 ${isTabletOrMobile ? "surface-0 hidden" : "surface-50 w-2"
                }`}
            style={{
                height: "96vh",
            }}
        >
            <TimelineTreeItemContext
                cm={cm}
                timelineId={timelineId}
                displayDialog={updateTimelineDialog}
                setDisplayDialog={setUpdateTimelineDialog}
            />
            <TimelineDialog eventData={updateTimelineDialog} setEventData={setUpdateTimelineDialog} />
            <TreeSidebar>
                <TimelinesFilter filter={filter} setFilter={setFilter} />
                <Tree
                    classes={{
                        root: "w-full overflow-y-auto projectTreeRoot p-0",
                        container: "list-none",
                        placeholder: "relative",
                    }}
                    tree={treeData}
                    rootId={"0"}
                    sort={false}
                    insertDroppableFirst={false}
                    initialOpen={
                        timelines?.filter((timeline) => timeline.expanded).map((timeline) => timeline.id) || false
                    }
                    render={(node: NodeModel<TimelineType>, { depth, isOpen, onToggle }) => (
                        <TimelineTreeItem
                            node={node}
                            timelineId={timelineId}
                            depth={depth}
                            isOpen={isOpen}
                            onToggle={onToggle}
                            setDisplayDialog={setUpdateTimelineDialog}
                            setTimelineId={setTimelineId}
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
                    //@ts-ignore
                    onDrop={(tree, options) => handleDrop(tree, options, setTreeData, sortChildrenMutation, project_id as string, "timelines")}

                />
            </TreeSidebar>
        </div>
    )
}