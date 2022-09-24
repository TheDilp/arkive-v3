import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { auth, getProfile, updateProfile } from "../../utils/supabaseUtils";
import { toastSuccess } from "../../utils/utils";
import Navbar from "../Nav/Navbar";
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
  console.log();
  if (error || isLoading) return <LoadingScreen />;

  const header = (
    <div className="w-15rem relative">
      <img
        alt="Card"
        className="border-rounded"
        style={{
          objectFit: "cover",
        }}
        src={
          auth.user()?.user_metadata.avatar_url ||
          localProfile?.profile_image ||
          `https://avatars.dicebear.com/api/bottts/${profile?.user_id}.svg`
        }
        onClick={() => {
          let newUrl = window.prompt("Enter the new profile image URL", "");
          if (newUrl && localProfile) {
            setLocalProfile({ ...localProfile, profile_image: newUrl });
            //   updateProfile(localProfile.id, undefined, localProfile.profile_image);
          }
        }}
      />
    </div>
  );
  const footer = (
    <div className="flex justify-content-end">
      <Button
        label="Save Profile"
        icon="pi pi-user-edit"
        iconPos="right"
        className="p-button-success p-button-outlined"
        onClick={() => {
          localProfile &&
            updateProfile(
              localProfile.id,
              localProfile.nickname,
              localProfile.profile_image
            ).then(() => toastSuccess("Profile successfully updated!"));
        }}
      />
    </div>
  );
  return (
    <div className="w-full h-screen flex flex-wrap align-content-start justify-content-center align-items-start ">
      <Navbar />
      <div className="h-full flex align-items-center">
        {localProfile && (
          <Card
            title={`${
              localProfile.nickname ? localProfile.nickname : ""
            } - Profile`}
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
                  ).then(() => toastSuccess("Profile successfully updated!"));
                }
              }}
              placeholder="Enter a nickname"
            />
          </Card>
        )}
      </div>
    </div>
  );
}
