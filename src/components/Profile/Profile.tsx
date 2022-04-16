import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import React, { useState } from "react";
import { useQuery } from "react-query";
import { getProfile } from "../../utils/supabaseUtils";
import LoadingScreen from "../Util/LoadingScreen";

export default function Profile() {
  const {
    data: profile,
    error,
    isLoading,
  } = useQuery("getProfile", async () => await getProfile());
  const [localProfile, setLocalProfile] = useState(profile || null);

  if (error || isLoading) return <LoadingScreen />;
  const header = (
    <img
      alt="Card"
      src={
        profile?.profile_image ||
        `https://avatars.dicebear.com/api/bottts/${profile?.user_id}.svg`
      }
    />
  );
  const footer = (
    <div className="flex justify-content-end">
      <Button
        label="Edit Profile"
        icon="pi pi-user-edit"
        iconPos="right"
        className="p-button-success p-button-outlined"
      />
    </div>
  );
  return (
    <div className="w-full h-full flex justify-content-center align-items-center">
      {localProfile && (
        <Card title="Profile" header={header} footer={footer}>
          <InputText
            value={localProfile.nickname}
            className="w-full"
            onChange={(e) =>
              setLocalProfile({ ...localProfile, nickname: e.target.value })
            }
            placeholder="Enter a nickname"
          />
        </Card>
      )}
    </div>
  );
}
