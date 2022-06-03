import { useMemo } from "react";
import { Doc } from "yjs";
import { WebrtcProvider } from "y-webrtc";
import * as awarenessProtocol from "y-protocols/awareness.js";
// import getRandomColor from '../utils/getRandomColor';

export interface User {
  name: string;
  [x: string]: any;
}

export function useYjsAwareness(
  user: User,
  doc: Doc
): awarenessProtocol.Awareness {
  return useMemo(() => {
    const awareness = new awarenessProtocol.Awareness(doc);
    awareness.setLocalStateField("user", {
      name: user.name,
      color: "#fff000",
    });
    return awareness;
  }, [user.name, doc]);
}

export default useYjsAwareness;

export function useWebRtcProvider(user: User, doc_id: string) {
  const ydoc = useMemo(() => new Doc({ guid: doc_id }), [doc_id]);
  const awareness = useYjsAwareness(user, ydoc);

  return useMemo(() => {
    const roomName = `yjs-${doc_id}`;
    // @ts-ignore opts param seems to expect ALL options
    return new WebrtcProvider(roomName, ydoc, {
      awareness,
    });
  }, [doc_id]);
}
