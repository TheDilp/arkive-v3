import { getYjsValue, syncedStore } from "@syncedstore/core";
import * as awarenessProtocol from "y-protocols/awareness.js";
import { WebrtcProvider } from "y-webrtc";
import { Doc } from "yjs";
// Create your SyncedStore store
export const store = syncedStore({ remirrorContent: {} });

// Get the Yjs document and sync automatically using y-webrtc
export const yDoc = getYjsValue(store);

export const awareness = new awarenessProtocol.Awareness(yDoc);

// @ts-ignore
