import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { useState } from "react";

import LoadingScreen from "../../components/Loading/LoadingScreen";
import Navbar from "../../components/Nav/Navbar";
import { useGetUser, useUpdateProfile } from "../../CRUD/AuthCRUD";
import { useCreateWebhook } from "../../CRUD/OtherCRUD";
import { useAuth } from "../../hooks/useAuth";
import { useHandleChange } from "../../hooks/useGetChanged";
import { UserType } from "../../types/userTypes";
import Webhook from "./Webhook";

export default function Profile() {
  const user = useAuth();
  const [localData, setLocalData] = useState<UserType | null>(null);
  const { isFetching } = useGetUser(
    user as string,
    {
      enabled: !!user,
      onSuccess: (data) => {
        setLocalData(data as UserType);
      },
    },
    false,
  );
  const [newWebhook, setNewWebhook] = useState({ title: "", url: "" });
  const { mutate } = useUpdateProfile();
  const { mutate: createWebhookMutation } = useCreateWebhook();
  const { handleChange, changedData } = useHandleChange({ data: localData, setData: setLocalData });
  if (isFetching || !localData) return <LoadingScreen />;
  return (
    <>
      <Navbar />
      <div className="flex h-full w-full flex-col items-center justify-start">
        <div className="mt-2 flex items-center bg-zinc-900 p-2">
          <div
            className="flex min-w-[20rem] flex-col items-center justify-between gap-y-4 "
            title={`${localData?.nickname} - Profile`}>
            <div className="relative w-60">
              <img
                alt="Profile"
                className="border-rounded"
                src={`https://avatars.dicebear.com/api/bottts/${localData?.id}.svg`}
                style={{
                  objectFit: "cover",
                }}
              />
            </div>
            <InputText
              className="w-full"
              name="nickname"
              onChange={(e) => handleChange(e.target)}
              placeholder="Enter a nickname"
              value={localData?.nickname}
            />
            <Button
              className="p-button-success p-button-outlined w-full"
              disabled={!changedData}
              icon="pi pi-user-edit"
              iconPos="right"
              label="Save profile"
              onClick={() => {
                if (localData?.id) mutate({ id: localData.id, ...changedData });
              }}
            />
          </div>
        </div>
        <div className="flex flex-col gap-4">
          {localData?.webhooks?.map((webhook) => (
            <Webhook key={webhook.id} {...webhook} />
          ))}
          <div className="flex w-full max-w-2xl justify-center gap-x-6">
            <InputText
              autoComplete="false"
              className="w-1/3"
              inputMode="text"
              name="Webhook title"
              onChange={(e) => setNewWebhook({ ...newWebhook, title: e.target.value })}
              placeholder="Webhook title"
              value={newWebhook.title}
            />
            <Password
              autoComplete="false"
              className="w-1/3"
              disabled={!newWebhook.title}
              feedback={false}
              name="Webhook url"
              onChange={(e) => setNewWebhook({ ...newWebhook, url: e.target.value })}
              placeholder="Webhook url"
              toggleMask
              type="text"
              value={newWebhook.url}
            />
            <Button
              className="p-button-outlined p-button-success w-1/3"
              icon="pi pi-plus"
              iconPos="right"
              label="Add webhook"
              onClick={() => {
                if (localData?.id)
                  createWebhookMutation({ user_id: localData.id, title: newWebhook.title, url: newWebhook.url });
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
