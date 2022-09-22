import {
  TimelineCreateType,
  TimelineType,
  TimelineUpdateType,
} from "../../types/TimelineTypes";
import { auth, supabase } from "../supabaseUtils";
import { toastError } from "../utils";

export const getTimelines = async (project_id: string) => {
  const { data, error } = await supabase
    .from<TimelineType>("timelines")
    .select(
      "*,timeline_events(*, image (id, title, link, timeline_ages(*))), parent(id, title), timeline_ages!timeline_ages_timeline_id_fkey(*)"
    )
    .eq("project_id", project_id)
    .order("sort", { foreignTable: "timeline_ages" });
  if (data) return data;
  if (error) {
    toastError("There was an error getting your timlines.");
    throw new Error(error.message);
  }
};
export const createTimeline = async (
  CreateTimelineProps: TimelineCreateType
) => {
  let user = auth.user();
  if (user) {
    const { data, error } = await supabase
      .from("timelines")
      .insert(CreateTimelineProps);
    if (data) return data;
    if (error) {
      toastError("There was an error creating your timeline.");
      throw new Error(error.message);
    }
  }
};
export const updatedTimeline = async (
  UpdateTimelineProps: TimelineUpdateType
) => {
  let user = auth.user();
  if (user) {
    const { data, error } = await supabase
      .from("timelines")
      .update(UpdateTimelineProps)
      .eq("id", UpdateTimelineProps.id);
    if (data) return data;
    if (error) {
      toastError("There was an error updating your timeline.");
      throw new Error(error.message);
    }
  }
};
export const deleteTimeline = async (timeline_id: string) => {
  let user = auth.user();

  if (user) {
    const { error } = await supabase
      .from<TimelineType>("timelines")
      .delete()
      .eq("id", timeline_id);

    if (error) {
      toastError("There was an error deleting your timeline.");
      throw new Error(error.message);
    }
  }
};
