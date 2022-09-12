import { Icon } from "@iconify/react";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { ContextMenu } from "primereact/contextmenu";
import React, { Dispatch, SetStateAction } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TimelineItemDisplayDialogProps } from "../../../types/TimelineTypes";
import { useDeleteTimeline, useUpdateTimeline } from "../../../utils/customHooks";
import { toastSuccess } from "../../../utils/utils";
type Props = {
    cm: React.RefObject<ContextMenu>;
    timelineId: string;
    displayDialog: TimelineItemDisplayDialogProps;
    setDisplayDialog: Dispatch<SetStateAction<TimelineItemDisplayDialogProps>>;
};

export default function TimelineTreeItemContext({
    cm,
    timelineId,
    displayDialog,
    setDisplayDialog,
}: Props) {
    const { project_id } = useParams();

    const deleteTimelineMutation = useDeleteTimeline();
    const updateTimelineMutation = useUpdateTimeline();
    const navigate = useNavigate();
    const confirmdelete = () => {
        confirmDialog({
            message: (
                <div>
                    {`Are you sure you want to delete ${displayDialog.title}?`}
                    {displayDialog.folder ? (
                        <div style={{ color: "var(--red-400)" }}>
                            <i className="pi pi-exclamation-triangle"></i>
                            This will delete all the sub-folders & sub-maps in this folder!
                        </div>
                    ) : (
                        ""
                    )}
                </div>
            ),
            header: `Delete ${displayDialog.title}`,
            icon: "pi pi-exclamation-triangle",
            acceptClassName: "p-button-outlined text-red-500",
            accept: async () => {
                if (displayDialog.id === timelineId) {
                    navigate("./");
                }
                deleteTimelineMutation.mutate({
                    id: displayDialog.id,
                    project_id: project_id as string,
                });
                setDisplayDialog({ ...displayDialog, show: false });
            },
            reject: () => { },
        });
    };
    const timelineItems = [
        {
            label: "Update Timeline",
            icon: () => <Icon icon="mdi:chart-timeline-variant" inline={true} className="mr-1" />,
            command: () => setDisplayDialog({ ...displayDialog, show: true }),
        },
        {
            label: "Toggle Public",
            icon: `pi pi-fw ${displayDialog.public ? "pi-eye" : "pi-eye-slash"}`,
            command: () =>
                updateTimelineMutation.mutate({
                    id: displayDialog.id,
                    public: !displayDialog.public,
                    project_id: project_id as string
                }),
        },
        { separator: true },
        {
            label: "View Public Timeline",
            icon: "pi pi-fw pi-external-link",
            command: () => navigate(`/view/${project_id}/timelines/${displayDialog.id}`),
        },
        {
            label: "Copy Public URL",
            icon: "pi pi-fw pi-link",
            command: () => {
                if (navigator && navigator.clipboard) {
                    navigator.clipboard
                        .writeText(
                            `${window.location.host}/view/${project_id}/timelines/${displayDialog.id}`
                        )
                        .then(() => {
                            toastSuccess("URL copied! 🔗");
                        });
                }
            },
        },
        {
            label: "Delete Timeline",
            icon: "pi pi-fw pi-trash",
            command: confirmdelete,
        },
    ];
    const folderItems = [
        {
            label: "Rename Folder",
            icon: "pi pi-fw pi-pencil",
            command: () => setDisplayDialog({ ...displayDialog, show: true }),
        },

        { separator: true },
        {
            label: "Delete Folder",
            icon: "pi pi-fw pi-trash",
            command: confirmdelete,
        },
    ];
    return (
        <>
            <ConfirmDialog />
            <ContextMenu
                model={displayDialog.folder ? folderItems : timelineItems}
                ref={cm}
                className="Lato w-14rem"
            />
        </>
    );
}
