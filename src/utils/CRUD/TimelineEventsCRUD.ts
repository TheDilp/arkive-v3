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
export const updateTimelineEvent = async (
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
export const deleteTimelineEvent = async ({
  id,
}: {
  id: string;
  project_id: string;
  timeline_id: string;
}) => {
  let user = auth.user();
  if (user) {
    const { error } = await supabase
      .from("timeline_events")
      .delete()
      .eq("id", id);

    if (error) {
      toastError("There was an error updating your timeline event.");
      throw new Error(error.message);
    }
  }
};
