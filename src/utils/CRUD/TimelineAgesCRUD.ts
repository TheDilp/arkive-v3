import {
  TimelineAgeCreateType,
  TimelineAgeType,
  TimelineAgeUpdateType,
} from "../../types/TimelineAgeTypes";
import { auth, supabase } from "../supabaseUtils";
import { toastError } from "../utils";

export const createTimelineAge = async (
  CreateTimelineAgeProps: TimelineAgeCreateType
) => {
  let user = auth.user();
  if (user) {
    const { data, error } = await supabase
      .from<TimelineAgeType>("timeline_ages")
      .insert({
        ...CreateTimelineAgeProps,
      });
    if (data) return data;
    if (error) {
      toastError("There was an error updating your timeline age.");
      throw new Error(error.message);
    }
  }
};
export const updateTimelineAge = async (
  UpdateTimelineAgeProps: TimelineAgeUpdateType
) => {
  let user = auth.user();
  if (user) {
    const { data, error } = await supabase
      .from<TimelineAgeType>("timeline_ages")
      .update({
        ...UpdateTimelineAgeProps,
      })
      .eq("id", UpdateTimelineAgeProps.id);
    if (data) return data;
    if (error) {
      toastError("There was an error updating your timeline age.");
      throw new Error(error.message);
    }
  }
};
export const deleteTimelineAge = async ({
  id,
}: {
  id: string;
  timeline_id: string;
}) => {
  let user = auth.user();
  if (user) {
    const { error } = await supabase
      .from("timeline_ages")
      .delete()
      .eq("id", id);

    if (error) {
      toastError("There was an error updating your timeline age.");
      throw new Error(error.message);
    }
  }
};
