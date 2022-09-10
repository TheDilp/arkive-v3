import { Dialog } from "primereact/dialog";

type Props = {
    showDialog: boolean;
    setShowDialog: (show: boolean) => void;
};

export default function TimelineEventUpdateDialog({
    showDialog,
    setShowDialog,
}: Props) {
    return (
        <Dialog
            header="Create Timeline Event"
            visible={showDialog}
            onHide={() => setShowDialog(false)}
            className="w-3"
        >
            TimelineEventUpdateDialog
        </Dialog>
    );
}
