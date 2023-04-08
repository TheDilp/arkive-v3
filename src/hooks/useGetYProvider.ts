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
      const { awareness } = p;
      awareness.setLocalStateField("user", {
        // Define a print name that should be displayed
        name: user?.firstName || `User ${Math.random() * 10}`,
        // Define a color that should be associated to the user:
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
      const { awareness } = p;
      awareness.setLocalStateField("user", {
        // Define a print name that should be displayed
        name: user?.firstName || `User ${Math.random() * 10}`,
        // Define a color that should be associated to the user:
        color: generateHexColor(),
      });
      setProvider(p);
      p.on("synced", () => {
        setSynced(true);
      });
    }
    return () => {
      firstRender.current = false;
    };
  }, [item_id]);

  return { provider, synced };
}
