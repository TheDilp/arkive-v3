import { NodeModel, Tree } from '@minoru/react-dnd-treeview';
import React, { useContext, useLayoutEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom';
import { TimelineItemDisplayDialogProps, TimelineType } from '../../../types/TimelineTypes';
import { useGetTimelines, useUpdateTimeline } from '../../../utils/customHooks';
import { TimelineItemDisplayDialogDefault } from '../../../utils/defaultValues';
import { getDepth } from '../../../utils/utils';
import { MediaQueryContext } from '../../Context/MediaQueryContext';
import TreeSidebar from '../../Util/TreeSidebar';
import DragPreview from '../../Wiki/DocumentTree/DragPreview';
import TimelinesFilter from './TimelinesFilter';
import TimelineTreeItem from './TimelineTreeItem';
import TimelineTreeItemContext from './TimelineTreeItemContext';

type Props = {}

export default function TimelinesTree({ }: Props) {
    const { project_id } = useParams()
    const { isTabletOrMobile } = useContext(MediaQueryContext)
    const [treeData, setTreeData] = useState<NodeModel<TimelineType>[]>([]);
    const [updateTimelinesDialog, setUpdateTimelinesDialog] = useState<TimelineItemDisplayDialogProps>(TimelineItemDisplayDialogDefault)
    const updateTimelineMutation = useUpdateTimeline();
    const [filter, setFilter] = useState("");
    const { data: timelines } = useGetTimelines(project_id as string);
    const cm = useRef() as any;

    const handleDrop = async (
        newTree: NodeModel<TimelineType>[],
        {
            dragSourceId,
            dragSource,
            dropTargetId,
        }: {
            dragSourceId: string;
            dragSource: NodeModel<TimelineType>;
            dropTargetId: string;
        }
    ) => {
        // Set the user's current view to the new tree
        setTreeData(newTree);
        // SAFEGUARD: If parent is the same, avoid unneccesary update
        if (dragSource.data?.parent?.id !== dropTargetId)
            await updateTimelineMutation.mutateAsync({
                id: dragSourceId,
                parent: dropTargetId === "0" ? null : dropTargetId,
                project_id: project_id as string
            });

    };

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
                    timelines.map((t) => ({
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
            className={` text-white pt-2 px-2 ${isTabletOrMobile ? "surface-0 hidden" : "surface-50 w-2"
                }`}
            style={{
                height: "96vh",
            }}
        >
            <TimelineTreeItemContext
                cm={cm}
                timelineId={"mapId"}
                displayDialog={updateTimelinesDialog}
                setDisplayDialog={setUpdateTimelinesDialog}
            />
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
                    sort={true}
                    insertDroppableFirst={true}
                    initialOpen={
                        timelines?.filter((timeline) => timeline.expanded).map((timeline) => timeline.id) || false
                    }
                    render={(node: NodeModel<TimelineType>, { depth, isOpen, onToggle }) => (
                        <TimelineTreeItem
                            node={node}
                            // mapId={mapId}
                            depth={depth}
                            isOpen={isOpen}
                            onToggle={onToggle}
                            // setDisplayDialog={setUpdateMapDialog}
                            // setMapId={setMapId}
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
                    onDrop={handleDrop}
                />
            </TreeSidebar>
        </div>
    )
}