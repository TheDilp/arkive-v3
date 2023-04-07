import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useState } from "react";

import LoadingScreen from "../../components/Loading/LoadingScreen";
import Navbar from "../../components/Nav/Navbar";
import { useGetUser, useUpdateProfile } from "../../CRUD/AuthCRUD";
import { useAuth } from "../../hooks/useAuth";
import { useHandleChange } from "../../hooks/useGetChanged";
import { UserType } from "../../types/userTypes";

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
  const { handleChange, changedData } = useHandleChange({ data: localData, setData: setLocalData });
  if (isFetching || !localData) return <LoadingScreen />;
  return (
    <div className="flex h-full flex-col ">
      <Navbar />

      <div className="flex h-full w-full flex-col items-center justify-start gap-y-8 p-8">
        <div
          className="flex w-full max-w-[80%] flex-col items-center justify-between gap-4 rounded border border-zinc-700 px-8"
          title={`${localData?.nickname} - Profile`}>
          <div className="w-full">
            <h1 className="pt-4 font-Merriweather text-4xl">Profile</h1>
          </div>
          <div className="flex w-full items-center justify-between">
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
              className="w-full max-w-[40%]"
              name="nickname"
              onChange={(e) => handleChange(e.target)}
              placeholder="Enter a nickname"
              value={localData?.nickname}
            />
            <div className="ml-auto">
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
        </div>
      </div>
    </div>
  );
}
