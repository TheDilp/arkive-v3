import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { getProfile, updateProfile } from "../../utils/supabaseUtils";
import LoadingScreen from "../Util/LoadingScreen";

export default function Profile() {
  const {
    data: profile,
    error,
    isLoading,
  } = useQuery("getProfile", async () => await getProfile());
  const [localProfile, setLocalProfile] = useState(profile || null);

  useEffect(() => {
    if (profile) setLocalProfile(profile);
  }, [profile]);

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
        onClick={() => {
          localProfile &&
            updateProfile(
              localProfile.id,
              localProfile.nickname,
              localProfile.profile_image
            );
        }}
      />
    </div>
  );
  return (
    <div className="w-full h-full flex justify-content-center align-items-center">
      {localProfile && (
        <Card
          title={`${localProfile.nickname} - Profile`}
          header={header}
          footer={footer}
        >
          <InputText
            value={localProfile.nickname}
            className="w-full"
            onChange={(e) =>
              setLocalProfile({ ...localProfile, nickname: e.target.value })
            }
            onKeyDown={(e) => {
              if (e.key === "Enter" && localProfile) {
                updateProfile(
                  localProfile.id,
                  localProfile.nickname,
                  localProfile.profile_image
                );
              }
            }}
            placeholder="Enter a nickname"
          />
        </Card>
      )}
    </div>
  );
}
