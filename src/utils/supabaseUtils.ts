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

export const auth = supabase.auth;

// Auth functions

export const login = async (email: string, password: string) => {
  const { user, error } = await supabase.auth.signIn({ email, password });
  if (user) return user;
  if (error) {
    toastError("There was an error logging you in. Please try again.");
    throw new Error(error.message);
  }
};

export const logout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    toastError("There was an error logging you out. Please try again.");
    throw new Error(error.message);
  }
};

// SELECT

export const getProjects = async () => {
  let user = auth.user();
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
  let user = auth.user();

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
  let user = auth.user();
  if (user) {
    const { data: documents, error } = await supabase
      .from<Document>("documents")
      .select("*")
      .eq("project_id", project_id);
    if (documents) return documents;
    if (error) {
      toastError("There was an error getting your documents.");
      throw new Error(error.message);
    }
  }
};
export const getDocumentsForSettings = async (project_id: string) => {
  let user = auth.user();
  if (user) {
    const { data: documents, error } = await supabase
      .from<Document>("documents")
      .select("id, title, image, categories, folder")
      .eq("project_id", project_id);
    if (documents) return documents;
    if (error) {
      toastError("There was an error getting your documents.");
      throw new Error(error.message);
    }
  }
};

// INSERT

export const createDocument = async (
  project_id: string,
  parent: string | undefined
) => {
  let user = auth.user();
  if (user) {
    const { data: document, error } = await supabase
      .from<Document>("documents")
      .insert({
        project_id,
        content: {
          type: "doc",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Write something awesome!",
                },
              ],
            },
          ],
        },
        user_id: user.id,
        parent: parent || "0",
        title: "New Document",
      });
    if (document) return document[0];
    if (error) {
      toastError("There was an error creating your document.");
      throw new Error(error.message);
    }
  }
};

// UPDATE
export const updateDocument = async (
  doc_id: string,
  title?: string,
  content?: RemirrorJSON,
  categories?: string[],
  folder?: boolean
) => {
  let user = auth.user();

  if (user) {
    const { data: document, error } = await supabase
      .from<Document>("documents")
      .update({
        title,
        content,
        categories,
        folder,
      })
      .eq("id", doc_id);

    if (document) return document[0];
    if (error) {
      toastError("There was an error updating your document.");
      throw new Error(error.message);
    }
  }
};
export const updateProject = async (
  project_id: string,
  title?: string,
  categories?: string[]
) => {
  let user = auth.user();

  if (user) {
    const { data: project, error } = await supabase
      .from<Project>("projects")
      .update({
        title,
        categories,
      })
      .eq("id", project_id);

    if (project) return project[0];
    if (error) {
      toastError("There was an error updating your project.");
      throw new Error(error.message);
    }
  }
};

// DELETE

export const deleteDocument = async (doc_id: string) => {
  let user = auth.user();

  if (user) {
    const { error } = await supabase
      .from<Document>("documents")
      .delete()
      .eq("id", doc_id);

    if (error) {
      toastError("There was an error deleting your document.");
      throw new Error(error.message);
    }
  }
};
export const deleteManyDocuments = async (doc_ids: string[]) => {
  let user = auth.user();

  if (user) {
    const { error } = await supabase
      .from<Document>("documents")
      .delete()
      .in("id", doc_ids);

    if (error) {
      toastError("There was an error deleting your documents.");
      throw new Error(error.message);
    }
  }
};
