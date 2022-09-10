import { Dialog } from "primereact/dialog";
import { useContext } from "react";
import { TimelineEventContext } from "../../../Context/TimelineEventContext";


export default function TimelineEventUpdateDialog() {
    const { showUpdateDialog, setShowUpdateDialog } = useContext(TimelineEventContext)

    return (
        <Dialog
            header="Create Timeline Event"
            visible={showUpdateDialog}
            onHide={() => setShowUpdateDialog(false)}
            className="w-3"
        >
            TimelineEventUpdateDialog
        </Dialog>
    );
}
