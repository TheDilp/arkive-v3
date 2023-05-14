import { useEffect, useRef, useState } from "react";
import { WebsocketProvider } from "y-websocket";
import * as Y from "yjs";

import { generateHexColor } from "../utils/uiUtils";

export function useGetYProvider(item_id: string, user: any) {
  const [provider, setProvider] = useState<WebsocketProvider | null>(null);
  const [synced, setSynced] = useState(false);
  const firstRender = useRef(true);
  useEffect(() => {
    setSynced(false);
    if (!provider && firstRender.current) {
      const ydoc = new Y.Doc();

      const p = new WebsocketProvider(import.meta.env.VITE_SYNC_SERVER, item_id, ydoc);

      p.awareness.setLocalStateField("user", {
        name: user?.firstName || `user-${Math.round(10000 * Math.random())}`,
        color: generateHexColor(),
      });
      // add content to ydoc
      setProvider(p);
      p.on("synced", () => {
        setSynced(true);
      });
    }
    if (provider) {
      provider.destroy();
      const ydoc = new Y.Doc();
      // add content to ydoc
      const p = new WebsocketProvider(import.meta.env.VITE_SYNC_SERVER, item_id, ydoc);

      p.awareness.setLocalStateField("user", {
        name: user?.firstName || `user-${Math.round(10000 * Math.random())}`,
        color: generateHexColor(),
      });

      setProvider(p);
      p.on("synced", () => {
        setSynced(true);
      });
    }
    return () => {
      firstRender.current = false;
      provider?.destroy();
    };
  }, [item_id]);

  return { provider, synced };
}
