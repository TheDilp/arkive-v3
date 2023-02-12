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
  const { mutate } = useUpdateProfile();

  const { handleChange, changedData } = useHandleChange({ data: localData, setData: setLocalData });
  if (isFetching || !localData) return <LoadingScreen />;
  return (
    <div className="flex h-full w-full flex-wrap content-start items-start justify-center">
      <Navbar />
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
    </div>
  );
}
