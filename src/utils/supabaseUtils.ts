import { createClient } from "@supabase/supabase-js";
import { RemirrorJSON } from "remirror";
import { StringMappingType } from "typescript";
import { Document, Map, MapMarker, Profile, Project } from "../custom-types";
import { toastError } from "./utils";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const supabase = createClient(
  supabaseUrl as string,
  supabaseKey as string
);

export const auth = supabase.auth;

// Auth functions
export const register = async (email: string, password: string) => {
  await supabase.auth.signUp({ email, password });
};
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
      .select("id, title, cardImage, user_id")
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
      .select("id, title, user_id")
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
      .select("*, parent(id, title)")
      .eq("project_id", project_id)
      .order("title", { ascending: true });
    if (documents) return documents;
    if (error) {
      toastError("There was an error getting your documents.");
      throw new Error(error.message);
    }
  }
};
export const getTags = async (project_id: string) => {
  const { data, error } = await supabase.rpc("get_tags", { p_id: project_id });
  if (data) return data;
  if (error) {
    toastError("There was an error getting your tags.");
    throw new Error(error.message);
  }
};
export const getMaps = async (project_id: string) => {
  const { data, error } = await supabase
    .from<Map>("maps")
    .select("*, markers(*)")
    .eq("project_id", project_id);
  if (data) return data;
  if (error) {
    toastError("There was an error getting your maps.");
    throw new Error(error.message);
  }
};
export const getProfile = async () => {
  let user = auth.user();
  if (user) {
    const { data: profile, error } = await supabase
      .from<Profile>("profiles")
      .select("id, nickname, profile_image")
      .eq("user_id", user.id);
    if (profile) return profile[0];
    if (error) {
      toastError("There was an error getting your profile.");
      throw new Error(error.message);
    }
  }
};
// INSERT

export const createDocument = async ({
  id,
  project_id,
  title,
  parent,
  content,
  icon,
  image,
  categories,
  folder,
}: {
  id?: string;
  title?: string;
  icon?: string;
  image?: string;
  project_id: string;
  parent?: string | null;
  categories?: string[];
  folder?: boolean;
  content?: RemirrorJSON | null;
}) => {
  let user = auth.user();
  if (user) {
    const { data: document, error } = await supabase
      .from<Document>("documents")
      .insert({
        id,
        project_id,
        title,
        content,
        image,
        icon,
        folder,
        categories,
        user_id: user.id,
        // @ts-ignore
        parent,
      });
    if (document) return document[0];
    if (error) {
      toastError("There was an error creating your document.");
      throw new Error(error.message);
    }
  }
};
export const createProject = async () => {
  let user = auth.user();
  if (user) {
    const { data: project, error } = await supabase
      .from<Project>("projects")
      .insert({
        title: "New Project",
        user_id: user.id,
        cardImage: "",
      });
    if (project) return project[0];
    if (error) {
      toastError("There was an error creating your project.");
      throw new Error(error.message);
    }
  }
};
export const createTemplate = async ({
  id,
  project_id,
  title,
  content,
  parent,
  icon,
  image,
  categories,
  folder,
}: {
  id: string;
  title: string;
  content: RemirrorJSON;
  project_id: string;
  icon?: string;
  image?: string;
  parent?: string | null;
  categories?: string[];
  folder?: boolean;
}) => {
  let user = auth.user();
  if (user) {
    const { data, error } = await supabase.from("documents").insert({
      id,
      project_id,
      title,
      content,
      parent,
      icon,
      image,
      categories,
      folder,
      template: true,
      user_id: user.id,
    });
    if (data) return data;
    if (error) {
      toastError("There was an error creating your template.");
      throw new Error(error.message);
    }
  }
};
export const createMapMarker = async ({
  id,
  map_id,
  text,
  icon,
  color,
  lat,
  lng,
  doc_id,
}: {
  id: string;
  map_id: string;
  lat: number;
  lng: number;
  icon?: string;
  color?: string;
  text?: string;
  doc_id?: string;
}) => {
  let user = auth.user();
  if (user) {
    const { data, error } = await supabase.from("markers").insert({
      id,
      map_id,
      text,
      icon,
      color,
      lat,
      lng,
    });
    if (data) return data;
    if (error) {
      toastError("There was an error creating your map marker.");
      throw new Error(error.message);
    }
  }
};

// UPDATE
export const updateDocument = async ({
  doc_id,
  title,
  content,
  folder,
  parent,
  image,
  icon,
  categories,
}: {
  doc_id: string;
  title?: string;
  content?: RemirrorJSON;
  folder?: boolean;
  parent?: string | null;
  image?: string;
  icon?: string;
  categories?: string[];
}) => {
  let user = auth.user();

  if (user) {
    const { data: document, error } = await supabase
      .from<Document>("documents")
      .update({
        title,
        content,
        folder,
        // @ts-ignore
        parent,
        image,
        icon,
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
export const updateProject = async (
  project_id: string,
  title?: string,
  categories?: string[],
  cardImage?: string
) => {
  let user = auth.user();

  if (user) {
    const { data: project, error } = await supabase
      .from<Project>("projects")
      .update({
        title,
        categories,
        cardImage,
      })
      .eq("id", project_id);

    if (project) return project[0];
    if (error) {
      toastError("There was an error updating your project.");
      throw new Error(error.message);
    }
  }
};
export const updateMapMarker = async ({
  id,
  icon,
  color,
  text,
  lat,
  lng,
}: {
  id: string;
  map_id: string;
  text?: string;
  icon?: string;
  color?: string;
  lat?: number;
  lng?: number;
}) => {
  const { data, error } = await supabase
    .from<MapMarker>("markers")
    .update({
      icon,
      color,
      text,
      lat,
      lng,
    })
    .eq("id", id);

  if (data) return data;
  if (error) {
    toastError("There was an error updating your map marker.");
    throw new Error(error.message);
  }
};
export const updateMultipleDocumentsParents = async (
  documents: Pick<Document, "id" | "parent">[]
) => {
  let user = auth.user();

  if (user) {
    const { data: updatedDocuments, error } = await supabase
      .from<Document>("documents")
      .upsert(documents);

    if (updatedDocuments) return updatedDocuments;
    if (error) {
      toastError("There was an error updating your documents.");
      throw new Error(error.message);
    }
  }
};
export const updateProfile = async (
  id: string,
  nickname?: string,
  profile_image?: string
) => {
  let user = auth.user();

  if (user) {
    const { data: profile, error } = await supabase
      .from<Profile>("profiles")
      .update({
        nickname,
        profile_image,
      })
      .eq("id", id);

    if (profile) return profile[0];
    if (error) {
      toastError("There was an error updating your profile.");
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
    const { error } = await supabase.rpc("delete_many_documents", {
      ids: doc_ids,
    });

    if (error) {
      toastError("There was an error deleting your documents.");
      throw new Error(error.message);
    }
  }
};
export const createManyDocuments = async () => {
  for (let index = 0; index < 20; index++) {
    createDocument({
      project_id: "81b55b26-a0f3-47e2-a8d2-761bead4b5cc",
      title: "New Document",
    });
  }
};
// createManyDocuments();
export const deleteProject = async (project_id: string) => {
  let user = auth.user();

  if (user) {
    const { error } = await supabase
      .from<Project>("projects")
      .delete()
      .eq("id", project_id);

    if (error) {
      toastError("There was an error deleting your project.");
      throw new Error(error.message);
    }
  }
};
export const removeUserFromProject = async (
  project_id: string,
  user_id: string
) => {
  const { error } = await supabase.from("projects_users").delete().match({
    project_id,
    user_id,
  });

  if (error) {
    toastError("There was an error removign a user from your project.");
    throw new Error(error.message);
  }
};
