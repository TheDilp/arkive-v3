import { getYjsValue, syncedStore } from "@syncedstore/core";
import * as awarenessProtocol from "y-protocols/awareness.js";
// Create your SyncedStore store
export const store = syncedStore({ remirrorContent: {} });

// Get the Yjs document and sync automatically using y-webrtc
export const yDoc = getYjsValue(store);

export const awareness = new awarenessProtocol.Awareness(yDoc);

// @ts-ignore
