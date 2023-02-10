import { useAtom } from "jotai";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { useState } from "react";

import LoadingScreen from "../../components/Loading/LoadingScreen";
import Navbar from "../../components/Nav/Navbar";
import { useGetUser } from "../../CRUD/AuthCRUD";
import { useAuth } from "../../hooks/useAuth";
import { useHandleChange } from "../../hooks/useGetChanged";
import { UserType } from "../../types/userTypes";
import { UserAtom } from "../../utils/Atoms/atoms";

export default function Profile() {
  const user = useAuth();
  const [, setUserAtom] = useAtom(UserAtom);
  const [localData, setLocalData] = useState<UserType | null>(null);
  const { isFetching } = useGetUser(
    user as string,
    {
      enabled: !!user,
      onSuccess: (data) => {
        setUserAtom(data as UserType);
        setLocalData(data as UserType);
      },
    },
    false,
  );

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
            disabled={!changedData}
            className="p-button-success p-button-outlined w-full"
            icon="pi pi-user-edit"
            iconPos="right"
            label="Save profile"
          />
        </div>
      </div>
    </div>
  );
}
