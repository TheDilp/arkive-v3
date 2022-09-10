import {
  TimelineEventCreateType,
  TimelineEventUpdateType,
} from "../../types/TimelineEventTypes";
import { auth, supabase } from "../supabaseUtils";
import { toastError } from "../utils";

export const createTimelineEvent = async (
  CreateTimelineEventProps: TimelineEventCreateType
) => {
  let user = auth.user();
  if (user) {
    const { data, error } = await supabase.from("timeline_events").insert({
      ...CreateTimelineEventProps,
      image: CreateTimelineEventProps.image?.id,
    });
    if (data) return data;
    if (error) {
      toastError("There was an error updating your timeline event.");
      throw new Error(error.message);
    }
  }
};
export const updatedTimelineEvent = async (
  UpdateTimelineEventProps: TimelineEventUpdateType
) => {
  let user = auth.user();
  if (user) {
    const { data, error } = await supabase
      .from("timeline_events")
      .update({
        ...UpdateTimelineEventProps,
        image: UpdateTimelineEventProps.image?.id,
      })
      .eq("id", UpdateTimelineEventProps.id);
    if (data) return data;
    if (error) {
      toastError("There was an error updating your timeline event.");
      throw new Error(error.message);
    }
  }
};
