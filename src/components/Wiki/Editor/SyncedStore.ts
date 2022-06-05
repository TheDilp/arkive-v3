import { syncedStore, getYjsValue } from "@syncedstore/core";
import { useState } from "react";
import { WebrtcProvider } from "y-webrtc";
import { Doc } from "yjs";
import { getProfile } from "../../../utils/supabaseUtils";

// Create your SyncedStore store
export const store = syncedStore({ remirrorContent: {} });

// Get the Yjs document and sync automatically using y-webrtc
const doc = getYjsValue(store);
export const webrtcProvider = new WebrtcProvider("ARKIVEPHEAGON", doc as Doc);
export const awareness = webrtcProvider.awareness;
awareness.on("change", () => {
  // Map each awareness state to a dom-string
  awareness.getStates().forEach((state) => {
    if (state.user) console.log(state);
  });
});
export const setRoom = (doc_id: string) => (webrtcProvider.roomName = doc_id);
export const disconnect = () => webrtcProvider.disconnect();
export const connect = () => webrtcProvider.connect();
