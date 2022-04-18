import React from "react";
import { Navigate, useParams } from "react-router-dom";
import { addUserToProject, auth } from "../../utils/supabaseUtils";

export default function InviteRoute() {
  const user = auth.user();
  const { project_id } = useParams();

  if (user && user.id && project_id) {
    addUserToProject(user.id, project_id);
  }

  return <Navigate to="/" />;
}
