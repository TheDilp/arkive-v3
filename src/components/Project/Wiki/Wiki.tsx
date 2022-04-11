import { useState } from "react";
import { useQueryClient } from "react-query";
import { Navigate, Route, Routes, useParams } from "react-router-dom";
import { auth } from "../../../utils/supabaseUtils";
import RemirrorContext from "../../Editor/RemirrorContext";
import ProjectTree from "../ProjectTree";
import PropertiesPanel from "../PropertiesPanel";
export default function Wiki() {
  const [docId, setDocId] = useState("");

  return !auth.user() ? (
    <Navigate to="/login" />
  ) : (
    <div className="w-full flex flex-wrap justify-content-start">
      <ProjectTree docId={docId} setDocId={setDocId} />

      <Routes>
        <Route
          path="/:doc_id"
          element={
            <>
              <RemirrorContext setDocId={setDocId} />
              <PropertiesPanel />
            </>
          }
        />
      </Routes>
    </div>
  );
}
