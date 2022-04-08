import { createClient } from "@supabase/supabase-js";
import { RemirrorJSON } from "remirror";
import { Document, Project } from "../custom-types";
import { toastError } from "./utils";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const supabase = createClient(
  supabaseUrl as string,
  supabaseKey as string
);

export const user = supabase.auth.user();

// Auth functions

export const login = async (email: string, password: string) => {
  const { user, error } = await supabase.auth.signIn({ email, password });
  if (user) return user;
  if (error) {
    toastError("There was an error logging you in. Please try again.");
    throw new Error(error.message);
  }
};

// SELECT

export const getProjects = async () => {
  if (user) {
    const { data: projects, error } = await supabase
      .from<Project>("projects")
      .select("id, title, cardImage")
      .eq("user_id", user.id);

    if (projects) return projects;
    if (error) {
      toastError("There was an error getting your projects.");
      throw new Error(error.message);
    }
  }
};
export const getCurrentProject = async (project_id: string) => {
  if (user) {
    const { data: project, error } = await supabase
      .from<Project>("projects")
      .select("categories")
      .eq("id", project_id);

    if (project) return project[0];
    if (error) {
      toastError("There was an error getting your project data.");
      throw new Error(error.message);
    }
  }
};
export const getDocuments = async (project_id: string) => {
  if (user) {
    const { data: documents, error } = await supabase
      .from<Document>("documents")
      .select("*")
      .eq("project_id", project_id);
    console.log(documents);
    if (documents) return documents;
    if (error) {
      toastError("There was an error getting your documents.");
      throw new Error(error.message);
    }
  }
};

// UPDATE

export const updateDocument = async (
  doc_id: string,
  content?: RemirrorJSON,
  categories?: string[]
) => {
  if (user) {
    const { data: document, error } = await supabase
      .from<Document>("documents")
      .update({
        content,
        categories,
      })
      .eq("id", doc_id);

    if (document) return document[0];
    if (error) {
      toastError("There was an error updating your document.");
      throw new Error(error.message);
    }
  }
};
