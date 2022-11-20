import { useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { Dialog } from "primereact/dialog";
import { FileUpload } from "primereact/fileupload";
import { useParams } from "react-router-dom";
import { DialogAtom } from "../../utils/Atoms/atoms";
import { DefaultDialog } from "../../utils/DefaultValues/DrawerDialogDefaults";

export default function DialogWrapper() {
  const { project_id } = useParams();
  const queryClient = useQueryClient();
  const [dialog, setDialog] = useAtom(DialogAtom);

  return (
    <Dialog visible={dialog.show} modal={dialog.modal} onHide={() => setDialog(DefaultDialog)}>
      <FileUpload
        name="quickupload[]"
        customUpload
        onUpload={(e) => console.log(e)}
        uploadHandler={async (e) => {
          console.log(e);
        }}
        multiple
        accept="image/*"
        maxFileSize={1000000}
        emptyTemplate={<p className="m-0">Drag and drop files to here to upload.</p>}
      />
    </Dialog>
  );
}
