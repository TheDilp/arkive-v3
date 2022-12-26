import { useAtom } from "jotai";
import { Dialog } from "primereact/dialog";
import { useState } from "react";

import { DialogAtom } from "../../utils/Atoms/atoms";
import { DefaultDialog } from "../../utils/DefaultValues/DrawerDialogDefaults";
import ExportBoard from "./ExportBoard";
import InsertImageEditor from "./InsertImageEditor";
import NodeFromDocument from "./NodeFromDocument";
import NodeSearch from "./NodeSearch";
import QuickUploadDialog from "./QuickUploadDialog";
import UpdateMapLayers from "./UpdateMapLayers";

export default function DialogWrapper() {
  const [dialog, setDialog] = useAtom(DialogAtom);
  const [uploading, setUploading] = useState(false);

  return (
    <Dialog
      className="p-0"
      contentClassName="pb-0"
      header={() => {
        if (dialog.type === "files") return "Upload Files";
        if (dialog.type === "map_layer") return "Edit Map Layers";
        if (dialog.type === "editor_image") return "Insert An Image";
        if (dialog.type === "node_search") return "Search nodes";
        if (dialog.type === "export_board") return "Export board";
        if (uploading) return "Uploading...";
        return null;
      }}
      modal={dialog.modal}
      onHide={() => {
        setDialog({ ...DefaultDialog, position: dialog.position });
      }}
      position={dialog.position}
      visible={dialog.show}>
      {dialog.type === "files" && <QuickUploadDialog setUploading={setUploading} />}
      {dialog.type === "map_layer" && <UpdateMapLayers />}
      {dialog.type === "editor_image" && <InsertImageEditor />}
      {dialog.type === "node_search" && <NodeSearch />}
      {dialog.type === "export_board" && <ExportBoard />}
      {dialog.type === "node_from_document" && <NodeFromDocument />}
    </Dialog>
  );
}
