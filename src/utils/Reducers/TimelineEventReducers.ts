import {
  TimelineEventDialogAction,
  TimelineEventDialogState,
} from "../../types/TimelineEventTypes";

export function TimelineEventDialogReducer(
  state: TimelineEventDialogState,
  action: TimelineEventDialogAction
): TimelineEventDialogState {
  const { type, payload } = action;
  switch (type) {
    case "SET_SHOW_CREATE":
      return {
        ...state,
        showCreateEvent: payload,
      };

    case "SET_SHOW_UPDATE":
      return {
        ...state,
        showUpdateEvent: payload,
      };

    case "SET_EVENT_DATA":
      return {
        ...state,
        eventData: payload,
      };
    default:
      return state;
  }
}
