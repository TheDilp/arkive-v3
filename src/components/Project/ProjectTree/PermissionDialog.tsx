import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { MultiStateCheckbox } from "primereact/multistatecheckbox";
import { Tooltip } from "primereact/tooltip";
import { useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import {
  Document,
  Project,
  treeItemDisplayDialog,
  UserPermissionType,
} from "../../../custom-types";
import { useUpdateDocument } from "../../../utils/utils";
type Props = {
  visible: treeItemDisplayDialog;
  setVisible: (visible: treeItemDisplayDialog) => void;
};

export default function PermissionDialog({ visible, setVisible }: Props) {
  const { project_id } = useParams();
  const queryClient = useQueryClient();
  const [users, setUsers] = useState<UserPermissionType[]>([]);
  const [currentDocument, setCurrentDocument] = useState<Document | null>();
  const options = [
    { value: "Scribe", icon: "pi pi-pencil" },
    { value: "Watcher", icon: "pi pi-eye" },
    { value: "None", icon: "pi pi-eye-slash" },
  ];
  const updateDocumentMutation = useUpdateDocument(project_id as string);
  useEffect(() => {
    if (visible) {
      const documents: Document[] | undefined = queryClient.getQueryData(
        `${project_id}-documents`
      );
      const project: Project | undefined = queryClient.getQueryData(
        `${project_id}-project`
      );

      if (documents) {
        setCurrentDocument(documents.find((doc) => doc.id === visible.id));
      }

      if (project && project.users) {
        setUsers(project.users.filter((el) => el.user_id !== project.user_id));
      }
    }
  }, [visible]);
  return (
    <Dialog
      header={`Permissions For - ${visible.title}`}
      visible={visible.show}
      onHide={() => setVisible({ id: "", title: "", show: false })}
      className="w-2 flex flex-wrap"
    >
      {users.map((user) => (
        <div
          className="w-full flex justify-content-between align-items-center"
          key={user.user_id}
        >
          <span>{user.profile.nickname}</span>
          <div>
            <Dropdown
              className="mr-2"
              options={options}
              defaultValue="None"
              value={
                currentDocument?.view_by.includes(user.user_id)
                  ? "Watcher"
                  : currentDocument?.edit_by.includes(user.user_id)
                  ? "Scribe"
                  : "None"
              }
              optionValue="value"
              optionLabel="value"
              onChange={(e) => {
                if (currentDocument) {
                  if (e.value === "Watcher") {
                    setCurrentDocument({
                      ...currentDocument,
                      view_by: [...currentDocument.view_by, user.user_id],
                      edit_by: currentDocument.edit_by.filter(
                        (el) => el !== user.user_id
                      ),
                    });
                    updateDocumentMutation.mutate({
                      doc_id: visible.id,
                      view_by: [...currentDocument.view_by, user.user_id],
                      edit_by: currentDocument.edit_by.filter(
                        (el) => el !== user.user_id
                      ),
                    });
                  } else if (e.value === "Scribe") {
                    setCurrentDocument({
                      ...currentDocument,
                      view_by: currentDocument.view_by.filter(
                        (el) => el !== user.user_id
                      ),
                      edit_by: [...currentDocument.edit_by, user.user_id],
                    });
                    updateDocumentMutation.mutate({
                      doc_id: visible.id,
                      view_by: currentDocument.view_by.filter(
                        (el) => el !== user.user_id
                      ),
                      edit_by: [...currentDocument.edit_by, user.user_id],
                    });
                  } else if (e.value === "None") {
                    setCurrentDocument({
                      ...currentDocument,
                      view_by: currentDocument.view_by.filter(
                        (el) => el !== user.user_id
                      ),
                      edit_by: currentDocument.edit_by.filter(
                        (el) => el !== user.user_id
                      ),
                    });
                    updateDocumentMutation.mutate({
                      doc_id: visible.id,
                      view_by: currentDocument.view_by.filter(
                        (el) => el !== user.user_id
                      ),
                      edit_by: currentDocument.edit_by.filter(
                        (el) => el !== user.user_id
                      ),
                    });
                  }
                }
              }}
            />
          </div>
        </div>
      ))}
    </Dialog>
  );
}
