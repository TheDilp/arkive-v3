import { useAtomValue } from "jotai";
import { Button } from "primereact/button";
import { useEffect } from "react";
import io from "socket.io-client";

import { baseURLS } from "../../types/CRUDenums";
import { UserAtom } from "../../utils/Atoms/atoms";
import { FetchFunction } from "../../utils/CRUD/CRUDFetch";
import { getCookie } from "../../utils/storage";

const token = getCookie("__session");

export default function RecentNotifications() {
  useEffect(() => {
    // Configure Socket.IO client with authorization headers
    const socket = io("wss://arkive-v3-server-development.up.railway.app", {
      extraHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    socket.on("new_notification", (data: any) => {
      console.log(data);
    });
    socket.on("connect", () => {
      console.log("connected");
    });
    socket.on("disconnect", () => {
      console.log("disconnected");
    });

    // ...

    return () => {
      // Disconnect the Socket.IO client
      socket.disconnect();
      socket.close();
      console.log("disconnected");
    };
  }, [token]);

  const user = useAtomValue(UserAtom);
  return (
    <div className="relative max-h-80 min-h-[20rem] w-80 max-w-[20rem] rounded bg-zinc-800 p-2">
      <Button
        label="Create notification"
        onClick={async () => {
          console.log(user?.id);
          if (user?.id)
            FetchFunction({
              url: `${baseURLS.baseServer}createnotification`,
              method: "POST",
              body: JSON.stringify({
                user_id: user.id,
                title: "New notification",
                content: "Testing notifications",
              }),
            });
        }}
      />
    </div>
  );
}
