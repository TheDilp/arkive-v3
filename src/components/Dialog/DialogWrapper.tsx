import { useAtom } from "jotai";
import { Dialog } from "primereact/dialog";
import { useState } from "react";

import { DialogAtom } from "../../utils/Atoms/atoms";
import { DefaultDialog } from "../../utils/DefaultValues/DrawerDialogDefaults";
import ExportBoard from "./ExportBoard";
import InsertImageEditor from "./InsertImageEditor";
import NodeFrom from "./NodeFrom";
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
        if (uploading) return "Uploading...";
        if (dialog.type === "files") return "Upload Files";
        if (dialog.type === "map_layer") return "Edit Map Layers";
        if (dialog.type === "editor_image") return "Insert an Image";
        if (dialog.type === "node_search") return "Search Nodes";
        if (dialog.type === "export_board") return "Export Board";
        if (dialog.type === "node_from_document") return "Create Node from a Document";
        if (dialog.type === "node_from_image") return "Create Node from an Image";
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
      {dialog.type === "node_from_document" && <NodeFrom type="documents" />}
      {dialog.type === "node_from_image" && <NodeFrom type="images" />}
    </Dialog>
  );
}
