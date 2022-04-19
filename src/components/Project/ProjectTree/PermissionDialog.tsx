import { Dialog } from "primereact/dialog";
import { MultiStateCheckbox } from "primereact/multistatecheckbox";
import { Tooltip } from "primereact/tooltip";
import { useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import {
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
  const options = [
    { value: "Scribe", icon: "pi pi-pencil" },
    { value: "Watcher", icon: "pi pi-eye" },
    { value: "None", icon: "pi pi-eye-slash" },
  ];
  const updateDocumentMutation = useUpdateDocument(project_id as string);
  useEffect(() => {
    if (visible) {
      const project: Project | undefined = queryClient.getQueryData(
        `${project_id}-project`
      );

      if (project && project.users) {
        let temp = project.users.filter((el) => el.user_id !== project.user_id);
        if (temp) setUsers(temp);
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
        <div className="w-full flex justify-content-between" key={user.user_id}>
          <span>{user.profile.nickname}</span>
          <div>
            <MultiStateCheckbox
              className="mr-2"
              empty={false}
              options={options}
              defaultValue="None"
              value={user.role}
              optionValue="value"
              onChange={(e) => {
                setUsers((users) => {
                  const newUsers = [...users];
                  let idx = newUsers.indexOf(user);
                  if (idx !== -1) {
                    newUsers[idx].role = e.value;
                  }
                  return newUsers;
                });
                updateDocumentMutation.mutate({
                  doc_id: visible.id,
                  view_by: users
                    .filter((el) => el.role === "Watcher")
                    .map((el) => el.user_id),
                });
              }}
            />
            <Tooltip
              target={`.${user.profile.nickname}-role`}
              position="bottom"
              content={
                user.role === "Scribe"
                  ? "Scribes can edit the document."
                  : user.role === "Watcher"
                  ? "Watchers can only view the document."
                  : "Users without permission won't see the document in the list."
              }
            />
            <span
              className={`${user.profile.nickname}-role underline cursor-pointer`}
            >
              ({user.role})
            </span>
          </div>
        </div>
      ))}
    </Dialog>
  );
}
