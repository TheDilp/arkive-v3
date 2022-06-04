import { getYjsValue, syncedStore } from "@syncedstore/core";
import { WebrtcProvider } from "y-webrtc";
import { Doc } from "yjs";

// Create your SyncedStore store
export const store = syncedStore({ remirrorContent: {} });

// Get the Yjs document and sync automatically using y-webrtc
const doc = getYjsValue(store);
export const webrtcProvider = new WebrtcProvider("ARKIVEPHEAGON", doc as Doc);
export const awareness = webrtcProvider.awareness;

export const setRoom = (doc_id: string) => (webrtcProvider.roomName = doc_id);
export const disconnect = () => webrtcProvider.disconnect();
export const connect = () => webrtcProvider.connect();
