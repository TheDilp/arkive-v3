import { useAtomValue } from "jotai";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { useState } from "react";

import { useCreateWebhook } from "../../CRUD/OtherCRUD";
import { useHandleChange } from "../../hooks/useGetChanged";
import { UserAtom } from "../../utils/Atoms/atoms";
import { toaster } from "../../utils/toast";

export default function NewWebhook() {
  const userData = useAtomValue(UserAtom);
  const { mutate: createWebhookMutation } = useCreateWebhook();
  const [newWebhook, setNewWebhook] = useState({ title: "", url: "" });
  const { handleChange, changedData } = useHandleChange({ data: newWebhook, setData: setNewWebhook });

  return (
    <div className="flex w-full max-w-2xl justify-center gap-x-6">
      <InputText
        autoComplete="false"
        className="w-1/3"
        inputMode="text"
        name="title"
        onChange={(e) => handleChange(e.target)}
        placeholder="Webhook title"
        value={newWebhook.title}
      />
      <Password
        autoComplete="false"
        className="w-1/3"
        disabled={!newWebhook.title}
        feedback={false}
        name="url"
        onChange={(e) => handleChange(e.target)}
        placeholder="Webhook url"
        toggleMask
        type="text"
        value={newWebhook.url}
      />
      <Button
        className="p-button-outlined p-button-success w-1/3"
        disabled={!newWebhook.title || !newWebhook.url}
        icon="pi pi-plus"
        iconPos="right"
        label="Add webhook"
        onClick={() => {
          if (changedData && userData?.id)
            createWebhookMutation(
              { user_id: userData.id, title: changedData.title, url: changedData.url, auth_id: userData.auth_id },
              {
                onSuccess: () => {
                  toaster("success", "Webhook added successfully");
                },
              },
            );
        }}
      />
    </div>
  );
}
